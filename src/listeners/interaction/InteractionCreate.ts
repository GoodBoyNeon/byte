import { CacheType, Interaction } from 'discord.js';
import {
  handleAutocomplete,
  handleChatInputCommands,
  handleMessageContextMenuCommands,
} from '../../handlers';
import { Listener } from '../../lib';

class InteractionCreate extends Listener<'interactionCreate'> {
  constructor() {
    super('interactionCreate');
  }

  protected async run(interaction: Interaction<CacheType>): Promise<void> {
    if (!interaction.inCachedGuild()) return;

    if (interaction.isChatInputCommand()) {
      await handleChatInputCommands(interaction);
    }
    if (interaction.isMessageContextMenuCommand()) {
      await handleMessageContextMenuCommands(interaction);
    }
    if (interaction.isAutocomplete()) {
      await handleAutocomplete(interaction);
    }
  }
}

export default InteractionCreate;
