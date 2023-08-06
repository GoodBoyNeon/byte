import { Message, PartialMessage } from 'discord.js';
import { client, prisma } from '../..';

export const isSuggestionMessage = async (message: Message | PartialMessage) => {
  const suggestionsConfig = await prisma.suggestionsConfig.findUnique({
    where: {
      guildId: message.guildId || '',
    },
  });
  return (
    message.author?.id === client.user?.id &&
    message.embeds[0]?.footer?.text === `Suggestion ID: ${message.id}` &&
    message.channelId === suggestionsConfig?.channelId
  );
};
