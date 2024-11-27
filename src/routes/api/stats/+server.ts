import { json } from '@sveltejs/kit';
import { SUPABASE_KEY, SUPABASE_URL } from '$env/static/private';

export async function GET() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/get_message_stats`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (!res.ok) {
      const error = await res.text();
      console.error(error);
			throw new Error('Failed to fetch stats');
		}
    return json(await res.json());

  } catch (error) {
    console.error(error);
    return json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}