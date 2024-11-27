import { writable } from 'svelte/store';
import type { User } from '$lib/types';

function createUserStore() {
  const { subscribe, set, update } = writable<User>({
    id: 'guest',
    tokens: 0
  });

  return {
    subscribe,
    addTokens: (amount: number) => update(user => ({
      ...user,
      tokens: user.tokens + amount
    })),
    removeTokens: (amount: number) => update(user => ({
      ...user,
      tokens: Math.max(0, user.tokens - amount)
    })),
    setNickname: (nickname: string) => update(user => ({
      ...user,
      nickname
    }))
  };
}

export const userStore = createUserStore();