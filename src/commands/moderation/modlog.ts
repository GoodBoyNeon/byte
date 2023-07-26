import { ModloggerType } from '.prisma/client';
import {
  ApplicationCommandOptionChoiceData,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord.js';
import {
  ChatInputCommand,
  Command,
  CommandReturnType,
  CommandRunParams,
} from '../../lib';
import { configureModlog } from '../../modules/';

const modlogChoices: ApplicationCommandOptionChoiceData<string>[] = Object.values(
  ModloggerType
).map(val => {
  return {
    name: val,
    value: val,
  };
});

class Modlog extends Command<ChatInputCommand> {
  constructor() {
    super({
      name: 'modlog',
      description: 'Manage mod logs',
      type: ApplicationCommandType.ChatInput,
      defaultMemberPermissions: ['ManageGuild'],
      legacy: false,
      application: true,
      defered: true,
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

  async run({
    interaction,
    guild,
    member,
  }: CommandRunParams<ChatInputCommand>): CommandReturnType {
    if (!interaction) return;
    if (!member) return;

    await interaction?.deferReply();

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
