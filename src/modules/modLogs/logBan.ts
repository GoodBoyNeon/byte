import {
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  WebhookClient,
} from 'discord.js';
import { booleanToEmoji } from '../../util';

export const logBan = async (
  target: GuildMember,
  interaction: CommandInteraction,
  webhookUrl: string,
  deleteMsg: boolean,
  dmed: boolean,
  reason?: string
) => {
  const embed = new EmbedBuilder({
    title: `${target.user.username} has been banned!`,
    description: `**${target.user.username}** (${target.user.id}) has been banned by ${interaction.member} (${interaction.user.id})`,
    fields: [
      {
        name: '**Reason**',
        value: reason ?? 'No reason provided.',
      },
      {
        name: 'DMed?',
        value: booleanToEmoji(dmed),
        inline: true,
      },
      {
        name: 'Deleted Messages?',
        value: booleanToEmoji(deleteMsg),
        inline: true,
      },
    ],
  });

  const webhook = new WebhookClient({
    url: webhookUrl,
  });
  webhook.send({
    embeds: [embed],
  });
};
