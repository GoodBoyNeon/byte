import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  GuildMember,
} from 'discord.js';
import { ChatInputCommand, Command, CommandRunParams } from '../../lib';
import { ban } from '../../modules/';

class Ban extends Command<ChatInputCommand> {
  constructor() {
    super({
      name: 'ban',
      type: ApplicationCommandType.ChatInput,
      description: 'Ban a user',
      defaultMemberPermissions: ['BanMembers'],
      options: [
        {
          name: 'user',
          description: 'The target user to ban',
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: 'delete_messages',
          description:
            "Delete the user's messages? If yes, deletes messages from last 7 days",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
        {
          name: 'reason',
          description: 'Reason for the ban',
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
    });
  }

  async run({ interaction }: CommandRunParams<ChatInputCommand>) {
    const target = interaction.options.getMember('user') as GuildMember;
    if (!target) return;

    const deleteMsg = interaction.options.getBoolean('delete_messages') ?? false;

    const reason = interaction.options.getString('reason') ?? undefined;

    await ban(target, interaction, deleteMsg, reason);
  }
}

export default Ban;
