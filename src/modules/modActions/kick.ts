import { CommandInteraction, EmbedBuilder, GuildMember } from 'discord.js';
import { colors, embeds } from '../../lib';
import { prisma } from '../..';
import { logKick } from '../modLogs/logKick';

export const kick = async (
  target: GuildMember,
  interaction: CommandInteraction<'cached'>,
  reason?: string
) => {
  if (!target.kickable) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder({
          title: 'I cannot kick that user!',
          color: colors.red,
        }),
      ],
      ephemeral: true,
    });
    return;
  }
  if (!interaction.memberPermissions?.has('KickMembers')) {
    await interaction.reply({
      embeds: [embeds.permissionError],
      ephemeral: true,
    });
  }
  if (target.roles.highest.position >= interaction.member.roles.highest.position) {
    await interaction.reply({
      embeds: [embeds.permissionError],
      ephemeral: true,
    });
  }

  let dmed: boolean;
  try {
    await target.send({
      embeds: [
        new EmbedBuilder({
          title: `You have been KICKED from ${interaction.guild?.name}.`,
          description: `**Reason:** ${reason ?? 'No reason provided.'}`,
          thumbnail: {
            url: interaction.guild?.iconURL() || '',
          },
          timestamp: new Date(),
          color: colors.red,
        }),
      ],
    });
    dmed = true;
  } catch {
    dmed = false;
  }

  await target.kick(reason);

  await interaction.reply({
    embeds: [
      new EmbedBuilder({
        description: `### **Successfully kicked ${target}!**`,
        // timestamp: new Date(),
        color: colors.green,
      }),
    ],
  });

  const logger = await prisma.modLogger.findUnique({
    where: {
      name_guildId: {
        name: 'Kick',
        guildId: interaction.guildId || '',
      },
    },
  });
  if (!logger) {
    await interaction.reply({ embeds: [embeds.error] });
    return;
  }

  if (logger.enabled && logger.webhookUrl) {
    await logKick(target, interaction, logger.webhookUrl, dmed, reason);
  }
};
