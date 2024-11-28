import { STRIPE_SECRET_KEY } from '$env/static/private';
import Stripe from 'stripe';
import { SHIELD_TIERS } from '$lib/types';

export const createPaymentSession = async (
	message: string,
	nickname: string,
	shieldType: string
) => {
	const stripe = new Stripe(STRIPE_SECRET_KEY);

	if (!stripe) {
		console.error('Failed to load Stripe');
		throw new Error('Failed to load Stripe');
	}

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card', 'paypal'],
		line_items: [
			{
				price_data: {
					currency: 'eur',
					product_data: {
						name: 'The Last Word Message',
						description: shieldType !== 'none' ? `With ${shieldType} shield protection` : undefined
					},
					unit_amount: SHIELD_TIERS[shieldType].price * 100
				},
				quantity: 1
			}
		],
		mode: 'payment',
		success_url: `https://the-last-word.flaviomoreno.fr/success`,
		cancel_url: `https://the-last-word.flaviomoreno.fr/`,
		payment_intent_data: {
			metadata: {
				message,
				nickname,
				shieldType
			}
		}
	});

	return session;
};
