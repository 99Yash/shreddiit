import { subredditValidator } from '@/lib/validators/subreddit';
import { NextRequest } from 'next/server';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    //todo: figure this out

    const { name } = subredditValidator.parse(req.body);
    //todo: check if subreddit already exists

    //* if subreddit exists
    return new Response('Subreddit already exists', {
      status: 409,
    });
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
