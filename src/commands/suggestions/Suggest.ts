import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
  TextChannel,
} from 'discord.js';
import {
  ChatInputCommand,
  Command,
  CommandRunParams,
  colors,
  emojis,
} from '../../lib';
import { client, prisma } from '../..';
import { SuggestionStatus } from '../../lib/types/SuggestionTypes';
import { getColor, getImpression, suggestionStatusMsg } from '../../modules';

class Suggest extends Command<ChatInputCommand> {
  constructor() {
    super({
      name: 'suggest',
      type: ApplicationCommandType.ChatInput,
      description: 'Make a suggestion!',
      options: [
        {
          name: 'suggestion',
          type: ApplicationCommandOptionType.String,
          description: 'Your suggestion',
          required: true,
        },
        {
          name: 'attachment',
          type: ApplicationCommandOptionType.Attachment,
          description: 'Any attachments you would like to have!',
          required: false,
        },
      ],
    });
  }

  async run({ interaction }: CommandRunParams<ChatInputCommand>) {
    if (!interaction) return;
    await interaction.deferReply({ ephemeral: true });

    const suggestion = interaction.options.getString('suggestion');
    const attachment = interaction.options.getAttachment('attachment');

    const suggestionsConfig = await prisma.suggestionsConfig.findUnique({
      where: {
        guildId: interaction?.guild?.id,
      },
    });
    if (!suggestionsConfig?.enabled) {
      await interaction.followUp({
        embeds: [
          new EmbedBuilder({
            title: 'This server has not enabled suggestions!',
            color: colors.red,
          }),
        ],
        ephemeral: true,
      });
      return;
    }
    if (!suggestionsConfig?.attachments && attachment) {
      await interaction.followUp({
        embeds: [
          new EmbedBuilder({
            title: 'This server does not support attachments for suggestions!',
            description: 'Please remove the attachment and try again.',
            color: colors.red,
          }),
        ],
        ephemeral: true,
      });
      return;
    }
    const channel = client.channels.cache.get(
      suggestionsConfig?.channelId || ''
    ) as TextChannel | null;

    if (!channel) {
      await interaction.followUp({
        embeds: [
          new EmbedBuilder({
            title: 'This server does not have a channel for suggestions!',
            color: colors.red,
          }),
        ],
        ephemeral: true,
      });
      return;
    }

    const status: SuggestionStatus = 'UnderReview';
    const value = suggestionStatusMsg[status];

    const impression = getImpression(1, 1);
    const color = getColor(1, 1);

    const embed = new EmbedBuilder({
      color,
      author: {
        name: interaction.user.username,
        iconURL: interaction.member.displayAvatarURL(),
      },
      title: 'New Suggestion',
      description: suggestion || '',
      fields: [
        {
          name: 'Status',
          value,
        },
        {
          name: 'Impressions',
          value: impression,
        },
      ],
      image: {
        url: attachment?.url || '',
      },
    });

    const message = await channel?.send({
      content: `*Suggestion by ${interaction.member}*`,
      embeds: [embed],
    });

    // await message?.edit({
    //   embeds: [
    //     embed.setFooter({
    //       text: `Suggestion ID: ${message.id} | Author ID: ${interaction.user.id}`,
    //     }),
    //   ],
    // });

    await message?.react(emojis.upvote);
    await message?.react(emojis.downvote);

    await message?.startThread({
      name: `${interaction.user.username}'s Suggestion`,
      reason: 'Suggestion',
    });

    await interaction.followUp({
      embeds: [
        new EmbedBuilder({
          title: 'Successfully suggested!',
          description: `Your suggestion has been sent in ${channel}`,
        }),
      ],
    });
  }
}

export default Suggest;
