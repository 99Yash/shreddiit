import { db } from '@/lib/db';
import { PostValidator } from '@/lib/validators/post';
import { auth } from '@clerk/nextjs';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    const body = await req.json();
    const { subredditId, title, content } = PostValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId,
      },
    });

    if (!subscriptionExists) {
      return new Response('Subscription to post is required', { status: 403 });
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: userId,
        subredditId,
      },
    });

    return new Response('OK', {
      status: 200,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response('Invalid data passed', {
        status: 422,
      });
    }
    return new Response("Couldn't post to subreddit this time", {
      status: 500,
    });
  }
}
