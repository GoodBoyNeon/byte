import { EmbedBuilder, Message, WebhookClient } from 'discord.js';
import { colors } from '../../lib';
import { srcbinify } from '../../util';

export const messageDeleteLogger = async (
  message: Message<true>,
  webhookUrl: string
) => {
  if (message.author?.bot) return;
  let contentValue: string = `\`\`\`${message.content}\`\`\``;

  if (contentValue?.length > 1024) {
    contentValue = `[Click here (sourceb.in)](${await srcbinify(
      message.content,
      message.author?.username
    )})`;
  }

  const embed = new EmbedBuilder({
    title: 'New Deleted Message',
    color: colors.secondary,
    author: {
      name: message.author?.username || '',
      iconURL: message.author?.displayAvatarURL(),
    },
    description: `**Author:** ${message.author?.username} (${message.member})\n**Channel:**${message.channel}`,

    footer: {
      text: 'Any embeds or files in the deleted message will be attached below',
    },
  });
  if (message.content.length !== 0) {
    embed.addFields({
      name: 'Content',
      value: contentValue,
    });
  }

  const webhook = new WebhookClient({
    url: webhookUrl,
  });
  await webhook.send({
    embeds: [embed, ...message.embeds],
  });
};
