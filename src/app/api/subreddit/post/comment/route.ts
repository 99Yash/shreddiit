import { db } from '@/lib/db';
import { commentValidator } from '@/lib/validators/comment';
import { auth } from '@clerk/nextjs';
import { z } from 'zod';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { postId, replyToId, text } = commentValidator.parse(body);
    const { userId } = auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    await db.comment.create({
      data: {
        postId,
        authorId: userId,
        text,
        replyToId,
      },
    });

    return new Response('OK', {
      status: 200,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response('Invalid request data passed', {
        status: 422,
      });
    }
    return new Response("Couldn't post to comments", {
      status: 500,
    });
  }
}
