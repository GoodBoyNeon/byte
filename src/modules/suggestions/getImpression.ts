import { emojis } from '../../lib';

export const getImpression = (upvotes: number, downvotes: number) => {
  const barLength = 10;
  const totalVotes = upvotes + downvotes;
  const upvotesPortion = Math.round((upvotes / totalVotes) * barLength);
  const downvotesPortion = barLength - upvotesPortion;

  return `${emojis.greenBox.repeat(upvotesPortion)}${emojis.redBox.repeat(
    downvotesPortion
  )}`;
};
