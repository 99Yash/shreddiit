import { db } from '@/lib/db';
import { subredditSubscriptionValidator } from '@/lib/validators/subreddit';
import { auth } from '@clerk/nextjs';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    const body = await req.json();
    const { subredditId } = subredditSubscriptionValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId,
      },
    });

    if (subscriptionExists) {
      return new Response('Already subscribed.', { status: 400 });
    }

    await db.subscription.create({
      data: {
        userId,
        subredditId,
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
