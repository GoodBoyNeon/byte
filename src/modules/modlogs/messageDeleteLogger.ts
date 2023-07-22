import { EmbedBuilder, Message, TextChannel, ThreadChannel } from 'discord.js';
import { srcbinify } from '../../util';
import { colors } from '../../lib';
import { client } from '../..';

export const messageDeleteLogger = async (
  message: Message<true>,
  channelId: string
) => {
  let isLink = false;

  let contentValue = `\`\`\`\n${message.content}\n\`\`\``;

  if (contentValue.length > 1024) {
    contentValue = await srcbinify(message.content, message.author?.username);
    isLink = true;
  }

  const embed = new EmbedBuilder({
    title: 'New Deleted Message',
    color: colors.secondary,
    author: {
      name: message.author?.username || '',
      iconURL: message.author?.displayAvatarURL(),
    },
    description: `**Author:** ${message.author?.username} (${message.member})`,
    fields: [
      {
        name: 'Content',
        value: contentValue,
      },
    ],
  });

  const channel = client.channels.cache.get(channelId) as
    | TextChannel
    | ThreadChannel;

  await channel.send({
    embeds: [embed],
  });
};
