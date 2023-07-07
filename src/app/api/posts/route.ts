import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { z } from 'zod';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const { userId } = auth();

  let followedCommunityIds: string[] = [];

  if (userId) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId,
      },
      include: {
        subreddit: true,
      },
    });

    followedCommunityIds = followedCommunities.map(({ subreddit }) => {
      return subreddit.id;
    });
  }
  try {
    const { limit, page, subredditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish().optional(),
      })
      .parse({
        subredditName: url.searchParams.get('subredditName'),
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
      });

    let whereClause = {};

    if (subredditName) {
      whereClause = {
        subreddit: {
          name: subredditName,
        },
      };
    } else if (userId) {
      whereClause = {
        subreddit: {
          id: {
            in: followedCommunityIds,
          },
        },
      };
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        //purposefully didn't include user, will delete it in prisma schema
        subreddit: true,
        votes: true,
        comments: true,
      },
      where: whereClause,
    });

    return new Response(JSON.stringify(posts));
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response('Invalid request data passed', {
        status: 422,
      });
    }
    return new Response('Could not fetch posts', {
      status: 500,
    });
  }
}
