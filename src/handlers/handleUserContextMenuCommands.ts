import { client } from '..';
import { ModifiedUserContextMenuCommandInteraction } from '../lib';

export const handleUserContextMenuCommands = async (
  interaction: ModifiedUserContextMenuCommandInteraction
) => {
  const command = client.userContextMenus.get(interaction.commandName);

  await command?.run({ client, interaction });
};
