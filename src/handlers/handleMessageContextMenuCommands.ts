import { MessageContextMenuCommandInteraction } from 'discord.js';
import { client } from '..';

export const handleMessageContextMenuCommands = async (
  interaction: MessageContextMenuCommandInteraction<'cached'>
) => {
  const command = client.messageContextMenus.get(interaction.commandName);

  await command?.run({ client, interaction });
};
