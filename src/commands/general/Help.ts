import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
} from 'discord.js';
import {
  ChatInputCommand,
  Command,
  CommandRunParams,
  ModifiedChatInputCommandInteraction,
  colors,
  emojis,
} from '../../lib';
import { capitalize, getFiles } from '../../util';
import path from 'path';
import { client } from '../..';

type Commands = {
  category: string;
  commandNames: string[];
};

class Help extends Command<ChatInputCommand> {
  constructor() {
    super({
      name: 'help',
      type: ApplicationCommandType.ChatInput,
      description: 'Help menu of Byte!',
      // options: [
      //   {
      //     name: 'command',
      //     description: 'Get info on a command of byte',
      //     type: ApplicationCommandOptionType.String,
      //     required: false,
      //     autocomplete: true,
      //   },
      // ],
    });
  }
  async run({ interaction }: CommandRunParams<ChatInputCommand>): Promise<void> {
    await interaction.deferReply();
    const command = interaction.options.getString('command');

    if (command) {
      await this.commandHelpMenu(command, interaction);
      return;
    }
    await this.helpMenu(interaction);
  }
  async helpMenu(interaction: ModifiedChatInputCommandInteraction) {
    const commands: Commands[] = [];

    const categories = getFiles(`${__dirname}/../`, false).map(p =>
      path.basename(p)
    );
    for (const cat of categories) {
      const commandNames = getFiles(`${__dirname}/../${cat}`).map(p =>
        path.basename(p, '.ts').toLowerCase()
      );
      commands.push({
        category: `${capitalize(cat)}`,
        commandNames,
      });
    }
    let description: string = '';
    commands.forEach(command => {
      description += `## ${command.category} (${command.commandNames.length})\n`;

      command.commandNames.forEach((commandName, i) => {
        description += `\`${commandName}\``;
        if (i !== command.commandNames.length - 1) {
          description += ', ';
        }
      });
      description.slice(0, -2);
      description += '\n';
    });

    const commandsLength = getFiles(`${__dirname}/../`, true).length;

    const embed = new EmbedBuilder({
      title: `${emojis.discovery} Help Menu (${commandsLength} commands)`,
      description,
      author: {
        name: client.user?.username || '',
        iconURL: client.user?.displayAvatarURL(),
      },
      timestamp: new Date(),
      thumbnail: {
        url: client.user?.displayAvatarURL() || '',
      },
      color: colors.green,
    });
    await interaction.followUp({ embeds: [embed] });
  }
  async commandHelpMenu(
    command: string,
    interaction: ModifiedChatInputCommandInteraction
  ) {}
}

export default Help;
