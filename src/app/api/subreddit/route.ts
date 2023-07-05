import { db } from '@/lib/db';
import { subredditValidator } from '@/lib/validators/subreddit';
import { auth } from '@clerk/nextjs';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { userId, getToken } = auth();

    const token = await getToken();

    if (!token) {
      return new Response('No token', { status: 404 });
    }
    const body = await req.json();
    const { name } = subredditValidator.parse(body);

    const subredditExists = await db.subreddit.findFirst({
      where: {
        name,
      },
    });

    if (subredditExists) {
      return new Response(
        'Subreddit already exists.Try entering another name.',
        {
          status: 409,
        }
      );
    }

    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: userId,
      },
    });

    //? subscribe user to own subreddit
    await db.subscription.create({
      data: {
        userId: userId!,
        subredditId: subreddit.id,
      },
    });

    return new Response(subreddit.name);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return new Response(err.message, {
        status: 422,
      });
    }
    return new Response("Couldn't create Subreddit", {
      status: 500,
    });
  }
}
