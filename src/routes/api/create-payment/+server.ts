import { json } from '@sveltejs/kit';
import { createPaymentSession } from '$lib/stripe';

export async function POST({ request }) {
  const { message, nickname } = await request.json();
  
  try {
    const session = await createPaymentSession(message, nickname);
    return json({ url: session.url });
  } catch (error) {
    return json({ error: 'Payment session creation failed' }, { status: 500 });
  }
}