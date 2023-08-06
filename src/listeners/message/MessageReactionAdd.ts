import {
  MessageReaction,
  PartialMessageReaction,
  User,
  PartialUser,
} from 'discord.js';
import { Listener } from '../../lib';
import { isSuggestionMessage } from '../../modules/suggestions/isSuggestionMessage';
import { updateSuggestionMessage } from '../../modules';

class MessageReactionAdd extends Listener<'messageReactionAdd'> {
  constructor() {
    super('messageReactionAdd');
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
      await updateSuggestionMessage(reaction, user, 'Add');
    }
  }
}

export default MessageReactionAdd;
