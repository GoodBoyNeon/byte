import { ClientEvents } from 'discord.js';

export type ListenerOptions<K extends keyof ClientEvents> = {
  name: string;
  once: boolean;
  event: K;
};
