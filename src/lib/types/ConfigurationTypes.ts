import { ModloggerType, Prisma } from '@prisma/client';
import { ChannelType } from 'discord.js';
import { type } from 'os';

export type ConfigurationData<T extends Prisma.ModelName> = {
  name: T;
};

export type ConfigurationOptionKeys = {
  name: string;
  prop: string;
  currentValue: string | number | boolean | null;
  possibleValues?: string[];
  channel?: boolean;
  channelType?: ChannelType;
  role?: boolean;
  user?: boolean;
};

export interface ConfigurationOptions {
  name: string;
  enabled: boolean;
  keys: ConfigurationOptionKeys[];
  [i: string]: NonNullable<unknown>;
}

export interface ModlogConfigurationOptions {
  name: ModloggerType;
  guildId: string;
  channelId: string | null;
  enabled?: boolean;
  webhookUrl?: string | null;
}
export type CollectorReturnType = {
  key: string;
  value: string;
};
