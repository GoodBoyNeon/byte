import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
  NewsChannel,
  PrivateThreadChannel,
  PublicThreadChannel,
  StageChannel,
  TextChannel,
  VoiceChannel,
} from 'discord.js';
import { ChatInputCommand, Command, CommandRunParams, colors } from '../../lib';

class FirstMsg extends Command<ChatInputCommand> {
  constructor() {
    super({
      name: 'firstmsg',
      description: 'Get the first message a channel',
      type: ApplicationCommandType.ChatInput,
      options: [
        {
          name: 'channel',
          description:
            'If specified, the bot will return the first message of the channel (leave empty for this channel)',
          type: ApplicationCommandOptionType.Channel,
          required: false,
        },
      ],
    });
  }
  async run({ interaction }: CommandRunParams<ChatInputCommand>): Promise<void> {
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    if (channel && !channel.isTextBased()) {
      await interaction.reply({
        content: 'The channel you mentioned is not a Text-Based Channel!',
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    const firstMsg = await this.getChannelFirstMsg(channel);

    const timestamp = `<t:${Math.floor(
      (firstMsg?.createdTimestamp ?? 0) / 1000
    )}:R>`;

    const embed = new EmbedBuilder({
      title: `First message in ${channel?.name}`,
      description: firstMsg?.content ?? '',
      url: firstMsg?.url,
      fields: [
        {
          name: 'Author',
          value: `${firstMsg?.author ?? 'Not found!'}`,
          inline: true,
        },
        {
          name: 'Was sent',
          value: timestamp,
          inline: true,
        },
      ],
      color: colors.green,
      footer: {
        text: "Attachments and embeds of the message will be shown below. Stickers can not be shown due to discord's API limitations",
      },
    }).setThumbnail(firstMsg?.author.displayAvatarURL() ?? null);

    const embeds = firstMsg?.embeds ? [embed, ...firstMsg.embeds] : [embed];

    await interaction.followUp({
      embeds,
      files: firstMsg?.attachments.map(a => a),
    });
  }
  async getChannelFirstMsg(
    channel:
      | NewsChannel
      | StageChannel
      | TextChannel
      | PrivateThreadChannel
      | PublicThreadChannel<boolean>
      | VoiceChannel
      | null
  ) {
    const messages = await channel?.messages.fetch({
      after: '0',
      limit: 1,
    });
    return messages?.first();
  }
}

export default FirstMsg;
