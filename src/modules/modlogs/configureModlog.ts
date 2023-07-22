import { ModloggerType } from '@prisma/client';
import { ModlogConfiguration } from './ModlogConfiguration';
import { ModifiedChatInputCommandInteraction, embeds } from '../../lib';
import { getOrCreateGuildConfig } from '../../util';

export const configureModlog = async (
  modlogName: ModloggerType,
  interaction: ModifiedChatInputCommandInteraction,
  guildId: string
) => {
  const modlogger = await getOrCreateGuildConfig({
    name: modlogName,
    guildId: guildId,
    channelId: null,
  });

  if (!modlogger)
    return {
      embeds: [embeds.error],
    };

  const configurator = new ModlogConfiguration({
    name: modlogName,
    guildId: modlogger?.guildId,
    channelId: modlogger?.channelId,
    enabled: modlogger?.enabled,
  });

  await configurator.init(interaction);
};
