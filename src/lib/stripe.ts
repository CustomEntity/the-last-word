import Stripe from 'stripe';

export const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

export const createPaymentSession = async (message: string, nickname: string) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'The Last Word Message',
          },
          unit_amount: 100, // €1.00
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${import.meta.env.VITE_PUBLIC_URL}/success`,
    cancel_url: `${import.meta.env.VITE_PUBLIC_URL}/`,
    metadata: {
      message,
      nickname,
    },
  });

  return session;
};