import { ApplicationCommandType, EmbedBuilder } from 'discord.js';
import { Command, CommandReturnType, CommandRunParams, colors } from '../../lib';
import ms from 'ms';

class Ping extends Command {
  constructor() {
    super({
      name: 'ping',
      description: 'Get the network information',
      type: ApplicationCommandType.ChatInput,
      application: true,
      legacy: true,
    });
  }

  async run({ client, interaction, message }: CommandRunParams): CommandReturnType {
    const uptime = ms(client.uptime || 0, {
      long: true,
    });
    const websocketPing = client.ws.ping;
    let botPing: number = 0;

    if (message) {
      const replyMessage = await message.reply(':ping_pong: Pinging...');
      botPing = replyMessage.createdTimestamp - message.createdTimestamp;

      await replyMessage.delete();
    }
    if (interaction) {
      const replyMessage = await interaction.fetchReply();
      botPing = replyMessage.createdTimestamp - interaction.createdTimestamp;
    }

    const embed = new EmbedBuilder({
      title: 'Pong!',
      fields: [
        {
          name: 'Uptime',
          value: `\`\`\`${uptime}\`\`\``,
          // inline: true,
        },
        {
          name: 'Websocket Ping',
          value: `\`\`\`${websocketPing}ms\`\`\``,
          // inline: true,
        },
        {
          name: 'Client Ping',
          value: `\`\`\`${botPing}ms\`\`\``,
          // inline: true,
        },
      ],
      color: colors.secondary,
    });

    return {
      embeds: [embed],
      ephemeral: false,
    };
  }
}

export default Ping;
