import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ColorResolvable,
  EmbedBuilder,
} from 'discord.js';
import {
  ChatInputCommand,
  Command,
  CommandRunParams,
  colors,
  emojis,
} from '../../lib';

class Role extends Command<ChatInputCommand> {
  constructor() {
    super({
      name: 'role',
      description: 'Manage roles',
      type: ApplicationCommandType.ChatInput,
      defaultMemberPermissions: ['ManageRoles'],
      options: [
        {
          name: 'create',
          description: 'Create a new role',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'name',
              description: 'Name of the role',
              type: ApplicationCommandOptionType.String,
              maxLength: 100,
              required: true,
            },
            {
              name: 'color',
              description: 'Specify the color of the role (in hex).',
              type: ApplicationCommandOptionType.String,
              maxLength: 7,
              required: false,
            },
            {
              name: 'hoist',
              description:
                'Specify whether or not to hoist the role (display on the member list). Defaults to false',
              type: ApplicationCommandOptionType.Boolean,
              required: false,
            },
            {
              name: 'mentionable',
              description:
                'Specify whether the role can be mentioned by anyone or not. Defaults to false',
              type: ApplicationCommandOptionType.Boolean,
              required: false,
            },
            {
              name: 'role_icon',
              description:
                'If your server eligible, you can also provide custom role icon for the role!',
              type: ApplicationCommandOptionType.Attachment,
              required: false,
            },
            {
              name: 'permissions_bit',
              description:
                "The bits that determine the permissions of the role. Defaults to the @everyone role's permissions",
              type: ApplicationCommandOptionType.String,
              required: false,
            },
          ],
        },
      ],
    });
  }
  async run({ interaction }: CommandRunParams<ChatInputCommand>): Promise<void> {
    const { options } = interaction;
    const subcommand = options.getSubcommand();
    if (!subcommand) return;
    if (subcommand === 'create') {
      const name = options.getString('name') ?? undefined;
      const hoist = options.getBoolean('hoist') ?? undefined;
      const mentionable = options.getBoolean('mentionable') ?? undefined;
      const roleIcon = options.getAttachment('role_icon');
      const color =
        (options.getString('color')?.startsWith('#')
          ? options.getString('color')
          : options.getString('color')?.trim().replace(/^/, '#')) ?? '#fff';

      if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder({
              description: `${color} is not a valid color! Role creation failed.`,
              color: colors.red,
            }),
          ],
          ephemeral: true,
        });
        return;
      }

      await interaction.deferReply({});

      interaction.guild.roles
        .create({
          name,
          hoist,
          mentionable,
          color: color as ColorResolvable,
          icon: roleIcon?.url,
          reason: `Via /role create (by ${interaction.user.username})`,
        })
        .then(async role => {
          await interaction.followUp({
            embeds: [
              new EmbedBuilder({
                title: `${emojis.tick} Created Role!`,
                description: `${role} has been created!`,
                color: colors.green,
              }),
            ],
          });
        })
        .catch(async () => {
          await interaction.followUp({
            embeds: [
              new EmbedBuilder({
                title: `Failed to create role.`,
                description:
                  'Please make sure the bot has enough permissions and the props are all correct',
                color: colors.red,
              }),
            ],
          });
        });
    }
  }
}

export default Role;
