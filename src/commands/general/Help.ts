import {
  ApplicationCommandOptionChoiceData,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  EmojiIdentifierResolvable,
} from 'discord.js';
import {
  ChatInputCommand,
  Command,
  CommandAutocompleteParams,
  CommandRunParams,
  colors,
  emojis,
} from '../../lib';
import {
  askGPT,
  capitalize,
  commandCategoryEmojiCache,
  getCachedCommands,
  getFiles,
} from '../../util';
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
      options: [
        {
          name: 'command',
          description: 'Get info on a command of byte',
          type: ApplicationCommandOptionType.String,
          required: false,
          autocomplete: true,
        },
      ],
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
  async autocomplete({ interaction }: CommandAutocompleteParams): Promise<void> {
    const commands: ApplicationCommandOptionChoiceData<string>[] =
      getCachedCommands(interaction.guild)?.map(c => ({
        name: `${c.name}`,
        value: c.name,
      })) ?? [];

    await interaction.respond(commands);
  }

  async helpMenu(interaction: ChatInputCommandInteraction<'cached'>) {
    const commands: Commands[] = [];

    const categories = getFiles(`${__dirname}/../`, false).map(p =>
      path.basename(p)
    );
    if (commandCategoryEmojiCache.size === 0) {
      await this.cacheCategoryEmoji(categories);
    }
    for (const cat of categories) {
      const commandNames = getFiles(`${__dirname}/../${cat}`).map(p =>
        path
          .basename(p)
          .replace(/\.[^/.]+$/, '') // Remove file extension
          .toLocaleLowerCase()
      );
      commands.push({
        category: `${capitalize(cat)}`,
        commandNames,
      });
    }
    let description: string = '';
    commands.forEach(command => {
      description += `## ${
        commandCategoryEmojiCache.get(command.category.toLowerCase()) ?? ''
      } ${command.category} (${command.commandNames.length})\n`;

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
      footer: { text: 'Use /help command-name to get more info about a command!' },
    });
    await interaction.followUp({ embeds: [embed] });
  }
  async commandHelpMenu(
    command: string,
    interaction: ChatInputCommandInteraction<'cached'>
  ) {
    const cachedCommands = getCachedCommands(interaction.guild);
    const cachedCommand = cachedCommands?.find(c => c.name === command);

    const commandFromCollection =
      client.chatInputCommands.get(command) ||
      client.userContextMenus.get(command) ||
      client.messageContextMenus.get(command.toLowerCase());

    const embed = new EmbedBuilder({
      color: colors.green,
      author: {
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      },
      thumbnail: {
        url: client.user?.displayAvatarURL() || '',
      },
      description: `
# Command Info (</${cachedCommand?.name}:${cachedCommand?.id}>)
> ${commandFromCollection?.data.description}

**Type:** ${this.commandTypeToString(cachedCommand?.type)}
`,
      fields: [
        {
          name: 'Required Permission(s)',
          value: `${
            cachedCommand?.defaultMemberPermissions?.toArray().join(', ') ?? 'None'
          }`,
        },
      ],
    });
    const subcommands = cachedCommand?.options.filter(
      o => o.type === ApplicationCommandOptionType.Subcommand
    );
    let subcommandsString = '';
    subcommands?.forEach(subcommand => {
      subcommandsString += `</${cachedCommand?.name} ${subcommand.name}:${cachedCommand?.id}>: ${subcommand.description}\n`;
    });
    const options = cachedCommand?.options.filter(
      o => o.type !== ApplicationCommandOptionType.Subcommand
    );
    let optionsString = '';
    options?.forEach((option, i) => {
      optionsString += `**${i + 1}. ${option.name}:** ${
        option.description
      }\n- Type: ${ApplicationCommandOptionType[option.type]}\n- Autocomplete?: ${
        option.autocomplete ? 'Yes' : 'No'
      }\n`;
    });

    if (subcommands && subcommands?.length !== 0) {
      embed.addFields({
        name: '**SubCommands**',
        value: `${subcommandsString}`,
      });
    } else if (options && options.length !== 0) {
      embed.addFields({
        name: '**Options**',
        value: optionsString,
      });
    }

    await interaction.followUp({
      embeds: [embed],
    });
  }
  commandTypeToString(commandType: ApplicationCommandType | undefined) {
    return commandType === 1
      ? 'Slash Command'
      : commandType === 2
      ? 'User Context Menu Command'
      : commandType === 3
      ? 'Message Context Menu Command'
      : null;
  }

  async cacheCategoryEmoji(categories: string[]) {
    const prompt = `Generate an emoji that best matches each of the following word separated by commas:\n${categories
      .join(', ')
      .trim()
      .slice(
        0,
        -1
      )}\nUse a JSON array for the emojis. ONLY INCLUDE THE EMOJI, NO OTHER TEXT.`;

    const res = await askGPT(prompt);
    const emojisJSON = res.choices[0]?.text.split("'").join('"');
    if (!emojisJSON) return;
    try {
      const matchRegExp = /\[.*?\]/;
      const emojisJSONMatch = emojisJSON.match(matchRegExp);
      if (!emojisJSONMatch) return;

      (JSON.parse(emojisJSONMatch[0]) as string[]).forEach(
        (emoji: EmojiIdentifierResolvable, i) => {
          commandCategoryEmojiCache.set(categories[i]?.toLowerCase() ?? '', emoji);
        }
      );
    } catch (error) {
      this.cacheCategoryEmoji(categories);
    }
  }
}

export default Help;
