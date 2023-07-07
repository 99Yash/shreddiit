import { auth } from '@clerk/nextjs';
import { Post, Vote, VoteType } from '@prisma/client';
import { notFound } from 'next/navigation';
import PostVoteClient from './PostVoteClient';

interface PostVoteServer {
  postId: string;
  initialVoteAmt?: number;
  initialVote?: VoteType | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

const PostVoteServer = async ({
  postId,
  initialVoteAmt,
  initialVote,
  getData,
}: PostVoteServer) => {
  const { userId } = auth();
  let _votesAmt: number = 0;
  let _currentVote: VoteType | null | undefined = undefined;

  if (getData) {
    const post = await getData();
    if (!post) {
      return notFound();
    }
    _votesAmt = post.votes.reduce((ac, val) => {
      if (val.voteType === 'UP') return ac + 1;
      if (val.voteType === 'DOWN') return ac - 1;
      return ac;
    }, 0);
    _currentVote = post.votes.find((vote) => vote.userId === userId)?.voteType;
  } else {
    _votesAmt = initialVoteAmt ?? 0;
    _currentVote = initialVote ?? null;
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVotes={_votesAmt}
      initialVote={_currentVote}
    />
  );
};

export default PostVoteServer;
