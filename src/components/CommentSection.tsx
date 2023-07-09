import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import PostComment from './PostComment';
import CreateComment from './CreateComment';

const CommentSection = async ({ postId }: { postId: string }) => {
  const { userId } = auth();

  const comments = await db.comment.findMany({
    where: {
      postId,
      replyTo: null,
    },
    include: {
      replies: {
        include: {
          votes: true,
        },
      },
      votes: true,
    },
  });

  return (
    <div className=" flex flex-col gap-y-4 mt-4 ">
      <hr className="w-full h-px my-6" />

      <CreateComment postId={postId} />
      <div className=" flex flex-col gap-y-6 mt-4 ">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLevelCmt) => {
            const topLevelCmtVotesAmt = topLevelCmt.votes.reduce(
              (acc, vote) => {
                if (vote.voteType === 'UP') {
                  return acc + 1;
                } else {
                  return acc - 1;
                }
              },
              0
            );

            const topLvlCmtVote = topLevelCmt.votes.find((vote) => {
              return vote.userId === userId;
            });

            return (
              <div key={topLevelCmt.id} className="flex flex-col ">
                <div className="mb-2">
                  {' '}
                  <PostComment
                    postId={postId}
                    currentVote={topLvlCmtVote}
                    votesAmt={topLevelCmtVotesAmt}
                    comment={topLevelCmt}
                  />{' '}
                </div>

                {topLevelCmt.replies
                  .sort((a, b) => {
                    return b.votes.length - a.votes.length;
                  })
                  .map((reply) => {
                    const replyVotesAmt = topLevelCmt.votes.reduce(
                      (acc, vote) => {
                        if (vote.voteType === 'UP') {
                          return acc + 1;
                        } else {
                          return acc - 1;
                        }
                      },
                      0
                    );

                    const replyVote = topLevelCmt.votes.find((vote) => {
                      return vote.userId === userId;
                    });

                    return (
                      <div
                        key={reply.id}
                        className=" ml-2 py-2 pl-4 border-l-2 border-zinc-200 "
                      >
                        <PostComment
                          comment={reply}
                          currentVote={replyVote}
                          votesAmt={replyVotesAmt}
                          postId={postId}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentSection;
