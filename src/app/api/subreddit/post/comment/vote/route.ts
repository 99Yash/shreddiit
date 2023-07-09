import { db } from '@/lib/db';
import { CommentVoteValidator } from '@/lib/validators/vote';
import { auth } from '@clerk/nextjs';

export async function PATCH(req: Request) {
  try {
    const { userId } = auth();
    if (!userId)
      return new Response('Unauthorized for voting', {
        status: 401,
      });

    const body = await req.json();
    const { commentId, voteType } = CommentVoteValidator.parse(body);

    const existingVote = await db.commentVote.findFirst({
      where: {
        commentId,
        userId,
      },
    });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await db.commentVote.delete({
          where: {
            commentId_userId: {
              commentId,
              userId,
            },
          },
        });
        return new Response('OK', {
          status: 200,
        });
      } else {
        await db.commentVote.update({
          where: {
            commentId_userId: {
              commentId,
              userId,
            },
          },
          data: {
            voteType,
          },
        });
        return new Response('OK', {
          status: 200,
        });
      }
    } else {
      await db.commentVote.create({
        data: {
          userId,
          voteType,
          commentId,
        },
      });
      return new Response('OK', {
        status: 200,
      });
    }
  } catch (err) {
    return new Response("Couldn't complete vote", {
      status: 500,
    });
  }
}
