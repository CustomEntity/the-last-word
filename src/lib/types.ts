export interface Message {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  duration?: string;
  payment_status: 'pending' | 'completed';
}

export interface Stats {
  totalMessages: number;
  averageDuration: string;
  longestMessage: Message | null;
  shortestMessage: Message | null;
}