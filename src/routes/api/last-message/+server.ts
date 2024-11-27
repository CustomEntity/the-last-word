import { json } from '@sveltejs/kit';
import type { Message } from '$lib/types';
import { SUPABASE_KEY, SUPABASE_URL } from '$env/static/private';

export async function GET({fetch}) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/messages?select=*&order=timestamp.desc&limit=1`,
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

    const [lastMessage] = await res.json();
    return json(lastMessage || null);

  } catch (error) {
    console.error(error);
    return json({ error: 'Failed to fetch last message' }, { status: 500 });
  }
}