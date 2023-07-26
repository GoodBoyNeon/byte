import { Message, PartialMessage } from 'discord.js';
import { Listener } from '../../lib';
import { prisma } from '../..';
import { messageEditLogger } from '../../modules/';

class MessageUpdate extends Listener<'messageUpdate'> {
  constructor() {
    super('messageUpdate');
  }

  protected async run(
    oldMessage: Message<boolean> | PartialMessage,
    newMessage: Message<boolean> | PartialMessage
  ): Promise<void> {
    if (oldMessage.inGuild()) {
      const guildConfig = await prisma.modLogger.findUnique({
        where: {
          name_guildId: {
            name: 'MessageEdit',
            guildId: newMessage.guildId || '',
          },
        },
      });
      if (guildConfig?.enabled && guildConfig.webhookUrl) {
        await messageEditLogger(oldMessage, newMessage, guildConfig.webhookUrl);
      }
    }
  }
}

export default MessageUpdate;
