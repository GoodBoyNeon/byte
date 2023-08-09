import { ApplicationCommandType } from 'discord.js';
import { Command, CommandRunParams, MessageCommand } from '../../lib';
import { srcbinify } from '../../util';

class Srcbinify extends Command<MessageCommand> {
  constructor() {
    super({
      name: 'srcbinify',
      description: "Generate a sourceb.in link for the message's content",
      type: ApplicationCommandType.Message,
    });
  }

  async run({ interaction }: CommandRunParams<MessageCommand>) {
    const content = interaction?.targetMessage.content;

    if (!content) {
      await interaction.reply({
        content: 'I can only srcbinify text content!',
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: await srcbinify(content),
      ephemeral: true,
    });
  }
}

export default Srcbinify;
