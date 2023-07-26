import { ApplicationCommandType, EmbedBuilder } from 'discord.js';
import {
  ChatInputCommand,
  Command,
  CommandReturnType,
  CommandRunParams,
  colors,
  emojis,
} from '../../lib';
import ms from 'ms';

class Ping extends Command<ChatInputCommand> {
  constructor() {
    super({
      name: 'ping',
      description: 'Get the network information',
      type: ApplicationCommandType.ChatInput,
      application: true,
      defered: true,
      legacy: true,
    });
  }

  async run({
    client,
    interaction,
    message,
  }: CommandRunParams<ChatInputCommand>): CommandReturnType {
    const uptime = ms(client.uptime || 0);
    const websocketPing = client.ws.ping;
    let botPing: number = 0;

    if (message) {
      const replyMessage = await message.reply(':ping_pong: Pinging...');
      botPing = replyMessage.createdTimestamp - message.createdTimestamp;

      await replyMessage.delete();
    }
    if (interaction) {
      const replyMessage = await interaction?.deferReply({
        ephemeral: true,
        fetchReply: true,
      });
      botPing = replyMessage.createdTimestamp - interaction.createdTimestamp;
    }

    const embed = new EmbedBuilder({
      title: 'Pong!',
      description: "Bot's Latency and Uptime",
      thumbnail: {
        url: client.user?.displayAvatarURL() || '',
      },
      fields: [
        {
          name: `${emojis.smiley} Uptime`,
          value: `\`\`\`\n${uptime}\n\`\`\``,
          inline: true,
        },
        {
          name: `${emojis.planet} Websocket Ping`,
          value: `\`\`\`\n${websocketPing}ms\n\`\`\``,
          inline: true,
        },
        {
          name: `${emojis.sprout} Client Ping`,
          value: `\`\`\`\n${botPing}ms\n\`\`\``,
          inline: true,
        },
      ],
      color: colors.primary,
    });

    return {
      embeds: [embed],
      ephemeral: true,
    };
  }
}

export default Ping;
