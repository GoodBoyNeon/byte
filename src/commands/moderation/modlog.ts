import {
  ApplicationCommandOptionChoiceData,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
} from 'discord.js';
import {
  Command,
  CommandReturnType,
  CommandRunParams,
  colors,
  embeds,
  emojis,
} from '../../lib';
import { ModloggerType } from '.prisma/client';
import { prisma } from '../..';
import { ModlogConfiguration, configureModlog } from '../../modules/modlogs';
import { getOrCreateGuildConfig } from '../../util';

const modlogChoices: ApplicationCommandOptionChoiceData<string>[] = Object.values(
  ModloggerType
).map(val => {
  return {
    name: val,
    value: val,
  };
});

class Modlog extends Command {
  constructor() {
    super({
      name: 'modlog',
      description: 'Manage mod logs',
      type: ApplicationCommandType.ChatInput,
      legacy: false,
      application: true,
      options: [
        {
          name: 'configure',
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
      ],
    });
  }

  async run({ interaction, guild, member }: CommandRunParams): CommandReturnType {
    if (!interaction) return;
    if (!member) return;

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'configure') {
      const modlogName = interaction.options.getString(
        'modlog_name'
      ) as ModloggerType;
      await configureModlog(modlogName, interaction, guild?.id || '');
    }
  }
}

export default Modlog;
