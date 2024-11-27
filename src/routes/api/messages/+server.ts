import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function GET() {
  try {
    const res = await fetch(
      `${env.SUPABASE_URL}/rest/v1/messages?select=*&order=timestamp.desc`,
      {
        headers: {
          'apikey': env.SUPABASE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_KEY}`
        }
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    const messages = await res.json();
    return json(messages);

  } catch (error) {
    console.error(error);
    return json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}