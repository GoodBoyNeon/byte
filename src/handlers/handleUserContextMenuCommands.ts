import { UserContextMenuCommandInteraction } from 'discord.js';
import { client } from '..';

export const handleUserContextMenuCommands = async (
  interaction: UserContextMenuCommandInteraction<'cached'>
) => {
  const command = client.userContextMenus.get(interaction.commandName);

  await command?.run({ client, interaction });
};
