import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  GuildMember,
} from 'discord.js';
import { ChatInputCommand, Command, CommandRunParams, embeds } from '../../lib';
import { getServerInfo, getUserInfo, getBotInfo } from '../../modules';

class Info extends Command<ChatInputCommand> {
  constructor() {
    super({
      name: 'info',
      description: 'Get information on a user or server',
      type: ApplicationCommandType.ChatInput,

      options: [
        {
          name: 'server',
          description: 'Get information about the server',
          type: ApplicationCommandOptionType.Subcommand,
        },
        {
          name: 'bot',
          description: 'Get information about Byte',
          type: ApplicationCommandOptionType.Subcommand,
        },
        {
          name: 'user',
          description: 'Get information on a user',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'target_user',
              description: 'The target user',
              required: false,
              type: ApplicationCommandOptionType.User,
            },
          ],
        },
      ],
    });
  }
  async run({ interaction }: CommandRunParams<ChatInputCommand>) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'user') {
      const targetMember =
        (interaction.options.getMember('target_user') as GuildMember) ||
        interaction.member;
      await getUserInfo(interaction, targetMember, false);
    }

    if (subcommand === 'server') await getServerInfo(interaction, false);
    if (subcommand === 'bot') await getBotInfo(interaction, false);
  }
}

export default Info;
