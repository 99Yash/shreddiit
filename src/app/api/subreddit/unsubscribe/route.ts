import { db } from '@/lib/db';
import { subredditSubscriptionValidator } from '@/lib/validators/subreddit';
import { auth } from '@clerk/nextjs';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new Response('Unauthenticated', { status: 400 });

    const body = await req.json();
    const { subredditId } = subredditSubscriptionValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId,
      },
    });

    if (!subscriptionExists) {
      return new Response('You are not subscribed to this.', { status: 400 });
    }

    const subreddit = await db.subreddit.findFirst({
      where: {
        id: subredditId,
        creatorId: userId,
      },
    });

    if (subreddit) {
      return new Response('You cannot unsubscribe from your own subreddit.', {
        status: 400,
      });
    }

    await db.subscription.delete({
      where: {
        userId_subredditId: {
          subredditId,
          userId,
        },
      },
    });

    return new Response(subredditId, {
      status: 200,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response('Invalid data passed', {
        status: 422,
      });
    }
    return new Response("Couldn't subscribe", {
      status: 500,
    });
  }
}
