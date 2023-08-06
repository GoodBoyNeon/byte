import { client } from '..';
import { ModifiedAutocompleteInteraction } from '../lib';

export const handleAutocomplete = async (
  interaction: ModifiedAutocompleteInteraction
) => {
  const command = client.chatInputCommands.get(interaction.commandName);

  if (!command?.autocomplete) {
    return;
  }

  await command?.autocomplete({ client, interaction });
};
