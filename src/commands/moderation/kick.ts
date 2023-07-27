import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  GuildMember,
} from 'discord.js';
import {
  ChatInputCommand,
  Command,
  CommandReturnType,
  CommandRunParams,
} from '../../lib';
import { kick } from '../../modules/';

class Kick extends Command<ChatInputCommand> {
  constructor() {
    super({
      name: 'kick',
      type: ApplicationCommandType.ChatInput,
      description: 'kick a user',
      legacy: false,
      application: true,
      defaultMemberPermissions: ['KickMembers'],
      options: [
        {
          name: 'user',
          description: 'The target user to kick',
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: 'reason',
          description: 'Reason for the kick',
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
    });
  }

  async run({ interaction }: CommandRunParams<ChatInputCommand>): CommandReturnType {
    if (!interaction) return;

    const target = interaction.options.getMember('user') as GuildMember;
    if (!target) return;

    const reason = interaction.options.getString('reason') ?? undefined;

    await kick(target, interaction, reason);
  }
}

export default Kick;
