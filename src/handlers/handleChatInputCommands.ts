import { client } from '..';
import { ModifiedChatInputCommandInteraction } from '../lib';

export const handleChatInputCommands = async (
  interaction: ModifiedChatInputCommandInteraction
) => {
  const command = client.chatInputCommands.get(interaction.commandName);

  await command?.run({ client, interaction });
};
