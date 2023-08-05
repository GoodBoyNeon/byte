import { Message, PartialMessage } from 'discord.js';
import { client } from '../..';

export const isSuggestionMessage = (message: Message | PartialMessage) => {
  return (
    message.author?.id === client.user?.id &&
    message.embeds[0].footer?.text === `Suggestion ID: ${message.id}`
  );
};
