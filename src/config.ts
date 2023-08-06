import {
  ClientOptions,
  GatewayIntentBits,
  Partials,
  PermissionFlagsBits,
} from 'discord.js';

export type Config = {
  clientOptions: ClientOptions;
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
  requiredPermissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.AddReactions,
    PermissionFlagsBits.ManageWebhooks,
  ],
};
