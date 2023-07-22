import { logger } from 'console-wizard';
import { prisma } from '..';
import { ModlogConfigurationOptions } from '../lib/types/ModlogTypes';

export const getOrCreateGuildConfig = async (
  options: ModlogConfigurationOptions
) => {
  try {
    const modlogger = await prisma.modLogger.findUnique({
      where: {
        name_guildId: {
          name: options.name,
          guildId: options.guildId,
        },
      },
    });

    if (!modlogger) {
      return await prisma.modLogger.create({
        data: {
          name: options.name,
          enabled: options.enabled || false,
          guildConfig: {
            connectOrCreate: {
              where: { guildId: options.guildId },
              create: { guildId: options.guildId },
            },
          },
          channelId: options.channelId,
        },
      });
    }
    return modlogger;
  } catch (error) {
    if (typeof error == 'string') logger.error(error);
  }
};
