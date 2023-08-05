import {
  ChatInputCommand,
  Command,
  CommandReturnType,
  CommandRunParams,
  colors,
} from '../../lib';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
  Message,
  TextChannel,
} from 'discord.js';
import { prisma } from '../..';
import { isSuggestionMessage } from '../../modules';
import {
  SuggestionStatus,
  SuggestionStatusField,
} from '../../lib/types/SuggestionTypes';
import { logger } from 'console-wizard';

class Suggestions extends Command<ChatInputCommand> {
  constructor() {
    super({
      name: 'suggestions',
      type: ApplicationCommandType.ChatInput,
      description: 'Manage suggestions',
      application: true,
      legacy: false,
      defered: true,
      defaultMemberPermissions: ['ManageMessages'],
      options: [
        {
          name: 'approve',
          description: 'Approve a suggestion',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'suggestion_id',
              type: ApplicationCommandOptionType.String,
              description: 'Id of the suggestion',
              required: true,
            },
          ],
        },
        {
          name: 'deny',
          description: 'Deny a suggestion',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'suggestion_id',
              type: ApplicationCommandOptionType.String,
              description: 'Id of the suggestion',
              required: true,
            },
          ],
        },
      ],
    });
  }

  async run({ interaction }: CommandRunParams<ChatInputCommand>): CommandReturnType {
    if (!interaction) return;
    await interaction.deferReply({ ephemeral: true });
    const subcommand = interaction.options.getSubcommand();
    const suggestionId = interaction.options.getString('suggestion_id');
    if (!suggestionId) return;

    const suggestionsConfig = await prisma.suggestionsConfig.findUnique({
      where: {
        guildId: interaction.guildId || '',
      },
    });
    const channel = interaction.guild?.channels.cache.get(
      suggestionsConfig?.channelId || ''
    ) as TextChannel;
    const suggestionMsg = await channel.messages.fetch(suggestionId);

    if (!isSuggestionMessage(suggestionMsg)) {
      return {
        embeds: [
          new EmbedBuilder({
            title: 'Invalid Suggestion ID!',
            description: `The suggestion ID (${suggestionId}) does not associate with any suggestions in this guild! Please re-check the ID and try again.`,
            color: colors.red,
          }),
        ],
        ephemeral: true,
      };
    }

    if (subcommand === 'approve') {
      return await this.updateStatus(suggestionMsg, 'Approved');
    }
    if (subcommand === 'deny') {
      return await this.updateStatus(suggestionMsg, 'Denied');
    }
  }
  protected async updateStatus(message: Message, value: SuggestionStatus) {
    const embed = message.embeds[0];
    if (!embed) {
      logger.error('no ');
      return;
    }

    const statusField: SuggestionStatusField = {
      name: 'Status',
      value,
    };

    const updatedEmbed = EmbedBuilder.from(embed).spliceFields(0, 1, statusField);

    await message.edit({
      embeds: [updatedEmbed],
    });

    return {
      content: `Suggestion ${value}!`,
    };
  }
}

export default Suggestions;
