import { ApplicationCommandType, EmbedBuilder } from 'discord.js';
import {
  ChatInputCommand,
  Command,
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
    });
  }

  async run({ client, interaction }: CommandRunParams<ChatInputCommand>) {
    const uptime = ms(client.uptime || 0);
    const websocketPing = client.ws.ping;
    let botPing: number = 0;

    const replyMessage = await interaction?.deferReply({
      ephemeral: true,
      fetchReply: true,
    });
    botPing = replyMessage.createdTimestamp - interaction.createdTimestamp;

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
      color: colors.green,
    });

    await interaction.followUp({
      embeds: [embed],
      ephemeral: true,
    });
  }
}

export default Ping;
