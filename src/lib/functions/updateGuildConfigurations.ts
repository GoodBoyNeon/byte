import { logger } from 'console-wizard';
import { prisma } from '../..';

export const updateGuildConfig = async () => {
  const guildConfigs = await prisma.guildConfiguration.findMany();

  for (const guildConfig of guildConfigs) {
    try {
      await prisma.suggestionsConfig.create({
        data: {
          enabled: false,
          guildId: guildConfig.guildId,
          channelId: null,
          attachments: false,
        },
      });
    } catch (err) {
      if (typeof err === 'string') {
        logger.error(err);
      }
    }
  }
};
