import { Interaction, CacheType } from 'discord.js';
import { Listener, ModifiedChatInputCommandInteraction } from '../lib';
import { handleChatInputCommands } from '../handlers';

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
  }
}

export default InteractionCreate;
