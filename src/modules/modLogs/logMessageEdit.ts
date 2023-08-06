import { EmbedBuilder, Message, PartialMessage, WebhookClient } from 'discord.js';
import { colors } from '../../lib';
import { srcbinify } from '../../util';

export const messageEditLogger = async (
  oldMessage: Message | PartialMessage,
  newMessage: Message | PartialMessage,
  webhookUrl: string
) => {
  if (newMessage.author?.bot) return;
  if (oldMessage.content === newMessage.content) return;

  let oldContentValue: string = `\`\`\`${oldMessage.content}\`\`\``;
  let newContentValue: string = `\`\`\`${newMessage.content}\`\`\``;

  if (oldContentValue?.length > 1024) {
    oldContentValue = `[Click here (sourceb.in)](${await srcbinify(
      oldMessage.content || '',
      oldMessage.author?.username
    )})`;
  }
  if (newContentValue.length > 1024) {
    newContentValue = `[Click here (sourceb.in)](${await srcbinify(
      newMessage.content || '',
      newMessage.author?.username
    )})`;
  }

  const embed = new EmbedBuilder({
    color: colors.secondary,
    description: `### [A message](${newMessage.url}) was edited!\n**Author:** ${oldMessage.author?.username} (${oldMessage.member})\n**Channel:**${newMessage.channel}`,
    author: {
      name: oldMessage.author?.username || '',
      iconURL: oldMessage.author?.displayAvatarURL(),
    },
    fields: [],
  });
  if (oldMessage.content?.length !== 0) {
    embed.addFields({
      name: 'Old Content',
      value: `${oldContentValue}`,
    });
  }
  if (newMessage.content?.length !== 0) {
    embed.addFields({
      name: 'New Content',
      value: `${newContentValue}`,
    });
  }
  const webhook = new WebhookClient({
    url: webhookUrl,
  });
  await webhook.send({ embeds: [embed] });
};
