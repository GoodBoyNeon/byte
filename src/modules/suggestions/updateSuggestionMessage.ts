import {
  EmbedBuilder,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from 'discord.js';
import { SuggestionStatus, emojis } from '../../lib';
import { getColor, getImpression } from '..';
import { logger } from 'console-wizard';

export const suggestionStatusMsg: Record<SuggestionStatus, string> = {
  Approved: `${emojis.tick} Approved`,
  Denied: `${emojis.x} Denied`,
  UnderReview: `${emojis.forums} Under Review`,
};

export const avoidBothReactions = async (
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
  isUpvote: boolean,
  isDownvote: boolean
) => {
  if (user.partial) {
    logger.warn('PartialUser in updateSuggestionMessage.ts');
    return;
  }
  const { message } = reaction;

  const downvoteReaction = message.reactions.cache.find(
    r => r.emoji.toString() === emojis.downvote
  );
  const downvoteReactionFromUser =
    downvoteReaction &&
    message.reactions.cache.find(r => r.users.cache.get(user.id));

  const upvoteReaction = message.reactions.cache.find(
    r => r.emoji.toString() === emojis.upvote
  );
  const upvoteReactionFromUser =
    upvoteReaction && message.reactions.cache.find(r => r.users.cache.get(user.id));

  /* Avoid the author from reacting */
  const suggestionAuthor = reaction.message.mentions.users?.first();
  if (suggestionAuthor?.id === user.id) {
    const reaction = isUpvote
      ? upvoteReaction
      : isDownvote
        ? downvoteReaction
        : undefined;

    if (!reaction) return;
    reaction.users.remove(user);
  }

  /* Avoid one user from reacting to both upvote and downvote */
  if (isUpvote && downvoteReactionFromUser) {
    message.reactions.cache
      .find(r => r.emoji.toString() === emojis.downvote)
      ?.users.remove(user);
  }

  if (isDownvote && upvoteReactionFromUser) {
    if (user.partial) {
      logger.warn('PartialUser in updateSuggestionMessage.ts');
      return;
    }
    message.reactions.cache
      .find(r => r.emoji.toString() === emojis.upvote)
      ?.users.remove(user);
  }
};

export const updateSuggestionMessage = async (
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
  type: 'Add' | 'Remove'
) => {
  if (user.bot) return;
  const { message } = reaction;
  const upvotes =
    message.reactions.cache.find(r => r.emoji.toString() === emojis.upvote)?.count ??
    0;
  const downvotes =
    message.reactions.cache.find(r => r.emoji.toString() === emojis.downvote)
      ?.count ?? 0;

  const emojiString = reaction.emoji.toString();
  const isUpvote = emojiString === emojis.upvote;
  const isDownvote = emojiString === emojis.downvote;

  if (isUpvote || isDownvote) {
    if (type === 'Add') {
      await avoidBothReactions(reaction, user, isUpvote, isDownvote);
    }

    const impression = getImpression(upvotes, downvotes);
    const color = getColor(upvotes, downvotes);

    const baseEmbed = message.embeds[0];
    if (!baseEmbed) return;
    const updatedEmbed = EmbedBuilder.from(baseEmbed)
      .spliceFields(1, 1)
      .addFields([
        {
          name: 'Impressions',
          value: impression,
        },
      ])
      .setColor(color);

    await message.edit({
      embeds: [updatedEmbed],
    });
  }
};
