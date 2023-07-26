import { ApplicationCommandType } from 'discord.js';
import {
  Command,
  CommandReturnType,
  CommandRunParams,
  MessageCommand,
} from '../../lib';
import { srcbinify } from '../../util';

class Srcbinify extends Command<MessageCommand> {
  constructor() {
    super({
      name: 'srcbinify',
      type: ApplicationCommandType.Message,
      application: true,
      legacy: false,
    });
  }

  async run({ interaction }: CommandRunParams<MessageCommand>): CommandReturnType {
    const content = interaction?.targetMessage.content;

    if (!content) {
      return {
        content: 'I can only srcbinify text content!',
        ephemeral: true,
      };
    }

    return {
      content: await srcbinify(content),
      ephemeral: true,
    };
  }
}

export default Srcbinify;
