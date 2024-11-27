import { json } from '@sveltejs/kit';
import { SUPABASE_KEY, SUPABASE_URL } from '$env/static/private';

export async function GET() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/messages?select=*&order=timestamp.desc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
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