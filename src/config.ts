import {
  ClientOptions,
  GatewayIntentBits,
  Partials,
  PermissionFlagsBits,
} from 'discord.js';

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
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  },
  primaryPrefix: '~',
  requiredPermissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.AddReactions,
    PermissionFlagsBits.ManageWebhooks,
  ],
};
