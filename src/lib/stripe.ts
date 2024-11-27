import Stripe from 'stripe';

export const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

export const createPaymentSession = async (message: string, nickname: string, shieldType: string) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'The Last Word Message',
            description: shieldType !== 'none' ? `With ${shieldType} shield protection` : undefined
          },
          unit_amount: getAmountForShield(shieldType),
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
      shieldType
    },
  });

  return session;
};

function getAmountForShield(shieldType: string): number {
  const SHIELD_PRICES = {
    none: 100, // €1.00
    bronze: 200, // €2.00
    silver: 350, // €3.50
    gold: 600, // €6.00
    platinum: 1000 // €10.00
  };
  
  return SHIELD_PRICES[shieldType as keyof typeof SHIELD_PRICES] || SHIELD_PRICES.none;
}