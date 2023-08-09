import { EmbedBuilder, GuildMember } from 'discord.js';
import { ModifiedCommandInteraction, colors, embeds } from '../../lib';
import { prisma } from '../..';
import { logBan, logKick } from '..';
import internal from 'stream';

export const ban = async (
  target: GuildMember,
  interaction: ModifiedCommandInteraction,
  deleteMsg: boolean,
  reason?: string
) => {
  if (!target.bannable) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder({
          title: 'I cannot ban that user!',
          color: colors.red,
        }),
      ],
      ephemeral: true,
    });
    return;
  }
  if (target.id === interaction.user.id) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder({
          title: 'You can not ban yourself!',
          color: colors.red,
        }),
      ],
      ephemeral: true,
    });
  }
  if (!interaction.memberPermissions?.has('BanMembers')) {
    await interaction.reply({
      embeds: [embeds.permissionError],
      ephemeral: true,
    });
  }
  if (target.roles.highest.position >= interaction.member.roles.highest.position) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder({
          title: "Your highest role is lower than the target's highest role!",
          color: colors.red,
        }),
      ],
      ephemeral: true,
    });
  }

  let dmed: boolean;
  try {
    await target.send({
      embeds: [
        new EmbedBuilder({
          title: `You have been BANNED from ${interaction.guild?.name}.`,
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

  if (deleteMsg) {
    await target.ban({
      reason,
      deleteMessageSeconds: 60 * 60 * 24 * 7, // 1 week
    });
  } else {
    await target.ban({
      reason,
    });
  }

  await interaction.reply({
    embeds: [
      new EmbedBuilder({
        description: `### **Successfully banned ${target}!**`,
        color: colors.green,
      }),
    ],
  });

  const logger = await prisma.modLogger.findUnique({
    where: {
      name_guildId: {
        name: 'Ban',
        guildId: interaction.guildId || '',
      },
    },
  });
  if (!logger) {
    await interaction.reply({ embeds: [embeds.error] });
    return;
  }

  if (logger.enabled && logger.webhookUrl) {
    await logBan(target, interaction, logger.webhookUrl, deleteMsg, dmed, reason);
  }
};
