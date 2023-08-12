import { ChatInputCommandInteraction } from 'discord.js';
import { client } from '..';

export const handleChatInputCommands = async (
  interaction: ChatInputCommandInteraction<'cached'>
) => {
  const command = client.chatInputCommands.get(interaction.commandName);

  await command?.run({ client, interaction });
};
