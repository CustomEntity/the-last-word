import { json } from '@sveltejs/kit';

export async function GET() {
  try {
    /*const messages = await xata.db.messages
      .filter('payment_status', 'completed')
      .sort('timestamp', 'desc')
      .getMany();*/

    const fakeMessages = [
      {
        "id": "1",
        "content": "Hello, world!",
        "author": "Anonymous",
        "timestamp": "2021-07-01T12:00:00.000Z",
        "payment_status": "completed"
      },
      {
        "id": "2",
        "content": "Hello, world!",
        "author": "Anonymous",
        "timestamp": "2021-07-01T12:00:00.000Z",
        "payment_status": "completed"
      }
      ];
    
    return json(fakeMessages);
  } catch (error) {
    return json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}