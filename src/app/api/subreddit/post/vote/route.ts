import { db } from '@/lib/db';
import { PostVoteValidator } from '@/lib/validators/vote';
import { auth } from '@clerk/nextjs';

export async function PATCH(req: Request) {
  try {
    const { userId } = auth();
    if (!userId)
      return new Response('Unauthorized for voting', {
        status: 401,
      });

    const body = await req.json();
    const { postId, voteType } = PostVoteValidator.parse(body);

    const existingVote = await db.vote.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await db.vote.delete({
          where: {
            postId_userId: {
              postId,
              userId,
            },
          },
        });
        return new Response('OK', {
          status: 200,
        });
      } else {
        await db.vote.update({
          where: {
            postId_userId: {
              postId,
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
      await db.vote.create({
        data: {
          userId,
          postId,
          voteType,
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
