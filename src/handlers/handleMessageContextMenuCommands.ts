import { client } from '..';
import { ModifiedMessageContextMenuCommandInteraction } from '../lib';

export const handleMessageContextMenuCommands = async (
  interaction: ModifiedMessageContextMenuCommandInteraction
) => {
  const command = client.messageContextMenus.get(interaction.commandName);

  await command?.run({ client, interaction });
};
