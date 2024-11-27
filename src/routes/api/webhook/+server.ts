import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_KEY, SUPABASE_URL } from '$env/static/private';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST({ request, fetch }) {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	try {
		if (!signature || !STRIPE_WEBHOOK_SECRET) {
			throw new Error('Missing stripe signature or webhook secret');
		}

		const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);

		if (event.type === 'payment_intent.succeeded') {
			const session = event.data.object as Stripe.PaymentIntent;

			const { message, nickname, shieldType } = session.metadata;

			console.log('Payment intent succeeded:', session.id, 'message:', message, 'nickname:', nickname, 'shieldType:', shieldType);
			await createMessage(fetch, {
				content: message,
				author: nickname,
				shield: shieldType,
				payment_status: 'completed',
				timestamp: new Date().toISOString()
			});
		}

		return json({ received: true });
	} catch (err) {
		console.error('Webhook error:', err);
		return json({ error: 'Webhook error' }, { status: 400 });
	}
}

async function createMessage(fetch, messageData) {
	const res = await fetch(
		`${SUPABASE_URL}/rest/v1/messages`,
		{
			headers: {
				'apikey': SUPABASE_KEY,
				'Authorization': `Bearer ${SUPABASE_KEY}`,
				'Content-Type': 'application/json',
				'Prefer': 'return=representation',
			},
			body: JSON.stringify(messageData),
			method: 'POST'
		}
	);

	if (!res.ok) {
		const text = await res.text();
		console.error('Failed to create message:', text);
		throw new Error('Failed to create message');
	}

	return res.ok;
}
