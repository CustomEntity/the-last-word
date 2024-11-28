import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST({ request, fetch }) {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	try {
		if (!signature || !env.STRIPE_WEBHOOK_SECRET) {
			throw new Error('Missing stripe signature or webhook secret');
		}

		const event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);

		if (event.type === 'payment_intent.succeeded') {
			const session = event.data.object as Stripe.PaymentIntent;
			const { message, nickname, shieldType } = session.metadata;

			// Récupérer le dernier message
			const lastMessage = await getLastMessage(fetch);

			// Créer le nouveau message
			await createMessage(fetch, {
				content: message,
				author: nickname,
				shield: shieldType,
				payment_status: 'completed',
				timestamp: new Date().toISOString()
			});

			// Si il y avait un message précédent, mettre à jour sa durée
			if (lastMessage) {
				const duration = calculateDuration(new Date(lastMessage.timestamp), new Date());
				await updateMessageDuration(fetch, lastMessage.id, duration);
			}

			return json({ received: true });
		}

		return json({ received: true });
	} catch (err) {
		console.error('Webhook error:', err);
		return json({ error: 'Webhook error' }, { status: 400 });
	}
}

async function getLastMessage(fetch) {
	const res = await fetch(
		`${env.SUPABASE_URL}/rest/v1/messages?select=*&order=timestamp.desc&limit=1`,
		{
			headers: {
				apikey: env.SUPABASE_KEY,
				Authorization: `Bearer ${env.SUPABASE_KEY}`
			}
		}
	);

	if (!res.ok) return null;

	const [lastMessage] = await res.json();
	return lastMessage;
}

async function createMessage(fetch, messageData) {
	const res = await fetch(`${env.SUPABASE_URL}/rest/v1/messages`, {
		headers: {
			apikey: env.SUPABASE_KEY,
			Authorization: `Bearer ${env.SUPABASE_KEY}`,
			'Content-Type': 'application/json',
			Prefer: 'return=representation'
		},
		body: JSON.stringify(messageData),
		method: 'POST'
	});

	if (!res.ok) {
		const text = await res.text();
		console.error('Failed to create message:', text);
		throw new Error('Failed to create message');
	}

	return res.json();
}

async function updateMessageDuration(fetch, messageId: string, duration: number) {
	const res = await fetch(`${env.SUPABASE_URL}/rest/v1/messages?id=eq.${messageId}`, {
		headers: {
			apikey: env.SUPABASE_KEY,
			Authorization: `Bearer ${env.SUPABASE_KEY}`,
			'Content-Type': 'application/json',
			Prefer: 'return=minimal'
		},
		body: JSON.stringify({ duration }),
		method: 'PATCH'
	});

	if (!res.ok) {
		console.error('Failed to update message duration');
		throw new Error('Failed to update message duration');
	}
}

function calculateDuration(startDate: Date, endDate: Date): number {
	return Math.floor((endDate.getTime() - startDate.getTime()) / 1000); // Durée en secondes
}
