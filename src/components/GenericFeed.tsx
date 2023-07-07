import { db } from '@/lib/db';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/siteConfig';
import PostFeed from './PostFeed';

const GenericFeed = async () => {
  const posts = await db.post.findMany({
    orderBy: {
      createdAt: 'desc',
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

export default GenericFeed;
