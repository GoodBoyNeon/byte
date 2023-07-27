import {
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  WebhookClient,
} from 'discord.js';
import { booleanToEmoji } from '../../util';

export const logKick = async (
  target: GuildMember,
  interaction: CommandInteraction,
  webhookUrl: string,
  dmed: boolean,
  reason?: string
) => {
  const embed = new EmbedBuilder({
    title: `${target.user.username} has been kicked!`,
    description: `**${target.user.username}** (${target.user.id}) has been kicked by ${interaction.member} (${interaction.user.id})`,
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
    ],
  });

  const webhook = new WebhookClient({
    url: webhookUrl,
  });
  webhook.send({
    embeds: [embed],
  });
};
