import MiniPostSubreddit from '@/components/MiniPostSubreddit';
import PostFeed from '@/components/PostFeed';
import { db } from '@/lib/db';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/siteConfig';
import { notFound } from 'next/navigation';

const Page = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const { slug } = params;

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });

  if (!subreddit) return notFound();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        {`r/${subreddit.name}`}
      </h1>
      <MiniPostSubreddit />
      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
    </>
  );
};

export default Page;
