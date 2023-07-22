import { ModloggerType } from '@prisma/client';
import { ModlogConfigurationOptions } from '../../lib/types/ModlogTypes';
import { ModlogConfiguration } from './ModlogConfiguration';
import { EmbedBuilder } from 'discord.js';
import { prisma } from '../..';
import { colors, emojis } from '../../lib';

export const configureModlog = async (
  loggerName: ModloggerType,
  guildId: string,
  options: ModlogConfigurationOptions
) => {
  if (loggerName === 'MessageDelete') {
  }
};
