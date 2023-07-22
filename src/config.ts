import { ClientOptions, GatewayIntentBits } from 'discord.js';

export type Config = {
  clientOptions: ClientOptions;
  primaryPrefix: string;
};

export const config: Config = {
  clientOptions: {
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessageReactions,
    ],
  },
  primaryPrefix: '~',
};
