import { db } from '@/lib/db';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/siteConfig';
import PostFeed from './PostFeed';
import { auth } from '@clerk/nextjs';

const CustomFeed = async () => {
  const { userId } = auth();
  const followedCommunities = await db.post.findMany({
    where: {
      authorId: userId,
    },
    include: {
      subreddit: true,
    },
  });

  const posts = await db.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      subredditId: {
        in: followedCommunities.map(({ subreddit }) => subreddit.id),
      },
    },
    include: {
      votes: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  });

  return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
