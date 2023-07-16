import { Message, MessageReplyOptions } from 'discord.js';
import { config } from '../config';
import { client } from '..';

export const handleLegacyCommands = async (message: Message) => {
  let content = message.content;

  content = content.substring(config.primaryPrefix.length);

  const args = content.split(/[ ]+/g);

  const commandName = args.shift()?.toLowerCase();
  if (!commandName) return;

  const command = client.legacyCommands.get(commandName);
  if (!command) return;

  const reply = await command.run({
    client,
    message,
    member: message.member,
    guild: message.guild,
    args,
  });

  if (!reply) return;

  await message.reply(reply as MessageReplyOptions);
};
