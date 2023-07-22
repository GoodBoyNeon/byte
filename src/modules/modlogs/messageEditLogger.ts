import {
  EmbedBuilder,
  Message,
  PartialMessage,
  TextChannel,
  ThreadChannel,
} from 'discord.js';
import { colors } from '../../lib';
import { srcbinify } from '../../util';
import { client } from '../..';

export const messageEditLogger = async (
  oldMessage: Message | PartialMessage,
  newMessage: Message | PartialMessage,
  channnelId: string
) => {
  if (oldMessage.partial) console.log('ol partial');
  if (newMessage.partial) console.log('ew partial');
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
    title: 'New Message Edited',
    color: colors.secondary,
    description: `**Author:** ${oldMessage.author?.username} (${oldMessage.member})`,
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
  const channel = client.channels.cache.get(channnelId) as
    | TextChannel
    | ThreadChannel;
  channel.send({ embeds: [embed] });
};
