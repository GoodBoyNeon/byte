import { Message, PartialMessage } from 'discord.js';
import { prisma } from '../..';
import { Listener } from '../../lib';
import { messageDeleteLogger } from '../../modules/';

class MessageDelete extends Listener<'messageDelete'> {
  constructor() {
    super('messageDelete');
  }
  protected async run(message: Message<boolean> | PartialMessage): Promise<void> {
    if (message.inGuild()) {
      const modLogger = await prisma.modLogger.findUnique({
        where: {
          name_guildId: {
            name: 'MessageDelete',
            guildId: message.guildId,
          },
        },
      });
      if (modLogger?.enabled && modLogger.webhookUrl) {
        await messageDeleteLogger(message, modLogger.webhookUrl);
      }
    }
  }
}

export default MessageDelete;
