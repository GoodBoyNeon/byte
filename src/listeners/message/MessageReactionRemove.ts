import {
  MessageReaction,
  PartialMessageReaction,
  User,
  PartialUser,
} from 'discord.js';
import { Listener } from '../../lib';
import { isSuggestionMessage } from '../../modules/suggestions/isSuggestionMessage';
import { updateSuggestionMessage } from '../../modules';

class MessageReactionRemove extends Listener<'messageReactionRemove'> {
  constructor() {
    super('messageReactionRemove');
  }

  protected async run(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ): Promise<void> {
    const { message } = reaction;

    if (reaction.partial) {
      await reaction.fetch();
    }
    if (user.partial) {
      await user.fetch();
    }

    const isSuggestionMsg = await isSuggestionMessage(message);
    if (isSuggestionMsg) {
      await updateSuggestionMessage(reaction, user, 'Remove');
    }
  }
}

export default MessageReactionRemove;
