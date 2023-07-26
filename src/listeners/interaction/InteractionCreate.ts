import { Interaction, CacheType } from 'discord.js';
import {
  Listener,
  ModifiedChatInputCommandInteraction,
  ModifiedMessageContextMenuCommandInteraction,
} from '../../lib';
import {
  handleChatInputCommands,
  handleMessageContextMenuCommands,
} from '../../handlers';

class InteractionCreate extends Listener<'interactionCreate'> {
  constructor() {
    super('interactionCreate');
  }

  protected async run(interaction: Interaction<CacheType>): Promise<void> {
    if (interaction.isChatInputCommand()) {
      await handleChatInputCommands(
        interaction as ModifiedChatInputCommandInteraction
      );
    }
    if (interaction.isMessageContextMenuCommand()) {
      await handleMessageContextMenuCommands(
        interaction as ModifiedMessageContextMenuCommandInteraction
      );
    }
  }
}

export default InteractionCreate;
