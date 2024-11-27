export interface Message {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  duration?: number;
  payment_status: 'pending' | 'completed';
  shield?: Shield['type'];
}

export interface Stats {
  totalMessages: number;
  averageDuration: string;
  longestMessage: Message | null;
  shortestMessage: Message | null;
}

export interface Shield {
  type: 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';
  duration: number; // in minutes
  price: number; // in tokens
}

export interface User {
  id: string;
  tokens: number;
  nickname?: string;
}

export const SHIELD_TIERS: Record<Shield['type'], Omit<Shield, 'type'>> = {
  none: { duration: 0, price: 0.50 },
  bronze: { duration: 5, price: 1.00 },
  silver: { duration: 10, price: 1.50 },
  gold: { duration: 15, price: 2.00 },
  platinum: { duration: 20, price: 2.50 }
};