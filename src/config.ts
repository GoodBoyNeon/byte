import { ClientOptions, GatewayIntentBits } from 'discord.js';

export type Config = {
  clientOptions: ClientOptions;
};

export const config: Config = {
  clientOptions: {
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  },
};
