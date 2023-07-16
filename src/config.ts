import { ClientOptions, GatewayIntentBits } from 'discord.js';

export type Config = {
  clientOptions: ClientOptions;
  primaryPrefix: string;
  prefixRegexp: string;
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
  primaryPrefix: '~',
  prefixRegexp: '^byte[, ]|^<@933839241962729562>',
};
