import { AutocompleteInteraction } from 'discord.js';
import { client } from '..';

export const handleAutocomplete = async (
  interaction: AutocompleteInteraction<'cached'>
) => {
  const command = client.chatInputCommands.get(interaction.commandName);

  if (!command?.autocomplete) {
    return;
  }

  await command?.autocomplete({ client, interaction });
};
