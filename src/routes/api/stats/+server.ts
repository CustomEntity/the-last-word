import { json } from '@sveltejs/kit';

export async function GET() {
  try {
/*    const messages = await xata.db.messages
      .filter('payment_status', 'completed')
      .getAll();

    const totalMessages = messages.length;
    
    let totalDuration = 0;
    let longestMessage = null;
    let shortestMessage = null;
    
    messages.forEach((message, index) => {
      const nextMessage = messages[index + 1];
      if (nextMessage) {
        const duration = new Date(nextMessage.timestamp).getTime() - 
                        new Date(message.timestamp).getTime();
        
        totalDuration += duration;
        
        if (!longestMessage || duration > longestMessage.duration) {
          longestMessage = { ...message, duration };
        }
        
        if (!shortestMessage || duration < shortestMessage.duration) {
          shortestMessage = { ...message, duration };
        }
      }
    });
    
    const averageDuration = totalMessages > 1 
      ? totalDuration / (totalMessages - 1)
      : 0;
    
    return json({
      totalMessages,
      averageDuration: Math.floor(averageDuration / 1000) + ' seconds',
      longestMessage,
      shortestMessage
    });*/

    return json({
      totalMessages: 2,
      averageDuration: '0 seconds',
      longestMessage: {
        "id": "1",
        "content": "Hello, world!",
        "author": "Anonymous",
        "timestamp": "2021-07-01T12:00:00.000Z",
        "payment_status": "completed",
        "duration": 1000
      },
      shortestMessage: {
        "id": "2",
        "content": "Hello, world!",
        "author": "Anonymous",
        "timestamp": "2021-07-01T12:00:00.000Z",
        "payment_status": "completed",
        "duration": 500
      }
    });
  } catch (error) {
    return json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}