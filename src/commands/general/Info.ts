import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  GuildMember,
} from 'discord.js';
import { Command, CommandReturnType, CommandRunParams, embeds } from '../../lib';
import { getServerInfo, getUserInfo } from '../../modules';

class Info extends Command {
  constructor() {
    super({
      name: 'info',
      description: 'Get information on a user or server',
      type: ApplicationCommandType.ChatInput,
      legacy: false,
      application: true,

      options: [
        {
          name: 'server',
          description: 'Get information on the server',
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
  async run({ interaction, member }: CommandRunParams): CommandReturnType {
    if (!interaction) return { embeds: [embeds.error], ephemeral: true };

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'user') {
      const targetMember =
        (interaction.options.getMember('target_user') as GuildMember) || member;
      return await getUserInfo(interaction, targetMember, false);
    }
    if (subcommand === 'server') {
      return await getServerInfo(interaction, false);
    }
  }
}

export default Info;
