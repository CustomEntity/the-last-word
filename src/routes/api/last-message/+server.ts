import { json } from '@sveltejs/kit';

export async function GET() {
  try {
    /*const lastMessage = await xata.db.messages
      .filter('payment_status', 'completed')
      .sort('timestamp', 'desc')
      .getFirst();
    */
    const fakeLastMessage = {
      "id": "1",
      "content": "卍 Nigger 卍",
      "author": "Anonymous",
      "timestamp": new Date(),
      "payment_status": "completed"
    }

    return json(fakeLastMessage);
  } catch (error) {
    return json({ error: 'Failed to fetch last message' }, { status: 500 });
  }
}