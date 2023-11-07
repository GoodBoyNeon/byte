import { ApplicationCommandType } from 'discord.js';
import {
  ChatInputCommand,
  Command,
  CommandRunParams,
  getRandomFortune,
} from '../../lib';

class Fortune extends Command<ChatInputCommand> {
  constructor() {
    super({
      name: 'fortune',
      description:
        'The fortune command of Linux - Get random quotes, jokes and texts',
      type: ApplicationCommandType.ChatInput,
    });
  }
  async run({ interaction }: CommandRunParams<ChatInputCommand>): Promise<void> {
    await interaction.reply({ content: getRandomFortune() });
  }
}
export default Fortune;
