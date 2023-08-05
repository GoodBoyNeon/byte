import {
  ApplicationCommandOptionChoiceData,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType,
  EmbedBuilder,
} from 'discord.js';
import {
  ChatInputCommand,
  Command,
  CommandReturnType,
  CommandRunParams,
  colors,
} from '../../lib';
import { ModloggerType } from '@prisma/client';
import { configureModlog } from '../../modules';
import { prisma } from '../..';
import { logger } from 'console-wizard';

const modlogChoices: ApplicationCommandOptionChoiceData<string>[] = Object.values(
  ModloggerType
).map(val => {
  return {
    name: val,
    value: val,
  };
});

class Configure extends Command<ChatInputCommand> {
  constructor() {
    super({
      name: 'configure',
      type: ApplicationCommandType.ChatInput,
      description: 'Configure byte as per your liking!',
      legacy: false,
      application: true,
      defered: true,
      options: [
        {
          name: 'modlog',
          description: 'Configure mod logs',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'modlog_name',
              description: 'Name of the mod log',
              type: ApplicationCommandOptionType.String,
              choices: modlogChoices,
              required: true,
            },
          ],
        },
        {
          name: 'suggestions',
          description: 'Configure Suggestions',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'enabled',
              description: 'Enable/disable suggestions',
              type: ApplicationCommandOptionType.Boolean,
              required: false,
            },
            {
              name: 'channel',
              description: 'Suggestions Channel',
              type: ApplicationCommandOptionType.Channel,
              required: false,
            },
            {
              name: 'attachments',
              description: 'Enable/disable attachments in suggestion',
              type: ApplicationCommandOptionType.Boolean,
              required: false,
            },
          ],
        },
      ],
    });
  }

  async run({
    interaction,
    member,
    guild,
  }: CommandRunParams<ChatInputCommand>): CommandReturnType {
    if (!interaction) return;
    if (!member) return;

    await interaction?.deferReply();

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'modlog') {
      const modlogName = interaction.options.getString(
        'modlog_name'
      ) as ModloggerType;
      await configureModlog(modlogName, interaction, guild?.id || '');
    }
    if (subcommand === 'suggestions') {
      const channel = interaction.options.getChannel('channel');
      const enabled = interaction.options.getBoolean('enabled');
      const attachments = interaction.options.getBoolean('attachments');
      if (channel) {
        if (channel?.type !== ChannelType.GuildText) {
          return {
            embeds: [
              new EmbedBuilder({
                description: `**${channel} is not a text channel!**`,
                color: colors.red,
              }),
            ],
          };
        }
        await prisma.suggestionsConfig.update({
          where: {
            guildId: guild?.id,
          },
          data: {
            channelId: channel.id,
          },
        });
      }
      if (enabled) {
        await prisma.suggestionsConfig.update({
          where: {
            guildId: guild?.id,
          },
          data: {
            enabled,
          },
        });
      }
      if (attachments) {
        await prisma.suggestionsConfig
          .update({
            where: {
              guildId: guild?.id,
            },
            data: {
              attachments,
            },
          })
          .catch(e => logger.error(e));
      }
    }
    return {
      embeds: [
        new EmbedBuilder({
          title: 'Successfully updated config!',
          color: colors.green,
        }),
      ],
    };
  }
}

export default Configure;
