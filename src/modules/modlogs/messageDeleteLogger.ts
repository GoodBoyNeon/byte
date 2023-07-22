import { EmbedBuilder, Message, TextChannel, ThreadChannel } from 'discord.js';
import { srcbinify } from '../../util';
import { colors } from '../../lib';
import { client } from '../..';

export const messageDeleteLogger = async (
  message: Message<true>,
  channelId: string
) => {
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
    description: `**Author:** ${message.author?.username} (${message.member})`,

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

  const channel = client.channels.cache.get(channelId) as
    | TextChannel
    | ThreadChannel;

  await channel.send({
    embeds: [embed, ...message.embeds],
    components: message.components,
  });
};
