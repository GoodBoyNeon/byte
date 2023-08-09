import { Guild } from 'discord.js';
import { client } from '..';

export const getCachedCommands = (guild: Guild | null) => {
  return process.env.NODE_ENV === 'development'
    ? guild?.commands.cache
    : client.application?.commands.cache;
};
