import { db } from '@/lib/db';
import { PostVoteValidator } from '@/lib/validators/vote';
import { auth } from '@clerk/nextjs';
import { z } from 'zod';

export async function PATCH(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    const body = await req.json();
    const { postId, voteType } = PostVoteValidator.parse(body);

    const vote = await db.vote.findFirst({
      where: {
        postId,
        userId,
      },
    });

    const post = await db.post.findFirst({
      where: {
        id: postId,
        authorId: {
          not: userId,
        },
      },
    });

    if (!post) return new Response('Post not found', { status: 404 });

    if (vote) {
      // if vote type is the same as existing vote, delete the vote
      if (vote.voteType === voteType) {
        await db.vote.delete({
          where: {
            postId_userId: {
              postId,
              userId,
            },
          },
        });
        return new Response('OK', { status: 200 });
      }
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response('Invalid data passed', { status: 422 });
    }
    return new Response("Couldn't vote this time", { status: 500 });
  }
}
