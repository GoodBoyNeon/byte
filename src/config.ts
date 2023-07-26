import { ClientOptions, GatewayIntentBits, PermissionFlagsBits } from 'discord.js';

export type Config = {
  clientOptions: ClientOptions;
  primaryPrefix: string;
  requiredPermissions: bigint[];
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
  requiredPermissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.AddReactions,
    PermissionFlagsBits.ManageWebhooks,
  ],
};
