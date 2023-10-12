import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
} from 'discord.js';
import {
  ChatInputCommand,
  Command,
  CommandAutocompleteParams,
  CommandRunParams,
  colors,
} from '../../lib';
import { cowsayFiles, eyes } from '../../modules';
import { getCowsayString } from '../../modules/cowsay/getCowsayString';
import { capitalize } from '../../util';

class Cowsay extends Command<ChatInputCommand> {
  constructor() {
    super({
      name: 'cowsay',
      description: 'A replica of the cowsay command of Linux!',
      type: ApplicationCommandType.ChatInput,
      options: [
        {
          name: 'text',
          description: 'What do you want the cow to say?',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: 'style',
          description:
            'Select the style of the cow. This value determines the eyes and tongue of the cow',
          type: ApplicationCommandOptionType.String,
          required: false,
          choices: Object.keys(eyes).map(k => ({ name: capitalize(k), value: k })),
        },
        {
          name: 'file',
          description: 'Choose a cowsay file. Equivalent to -f flag',
          autocomplete: true,
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
    });
  }
  async autocomplete({ interaction }: CommandAutocompleteParams): Promise<void> {
    const option = interaction.options.getFocused(true);
    if (option.name === 'file') {
      const filtered = cowsayFiles.filter(
        c => c?.toLowerCase().includes(option.value.toLowerCase())
      );
      await interaction.respond(
        filtered
          .map(c => ({
            name: capitalize(c ?? '')
              .split('-')
              .join(' '),
            value: c ?? '',
          }))
          .slice(0, 25)
      );
    }
  }
  async run({
    interaction,
  }: CommandRunParams<ApplicationCommandType.ChatInput>): Promise<void> {
    const text = interaction.options.getString('text') ?? '';
    const file = interaction.options.getString('file') ?? 'default';
    const style = (interaction.options.getString('style') ??
      'default') as keyof typeof eyes;

    if (!Object.keys(eyes).includes(style)) return;
    if (!cowsayFiles.includes(file)) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: 'Invalid File!',
            description:
              'The value of file option appears to be invalid! Please only enter the values showed in the autocomplete menu!',
            color: colors.red,
          }),
        ],
        ephemeral: true,
      });
      return;
    }
    await interaction.reply(`\`\`\`${getCowsayString({ text, file, style })}\`\`\``);
  }
}

export default Cowsay;
