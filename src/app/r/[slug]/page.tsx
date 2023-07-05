import MiniPostSubreddit from '@/components/MiniPostSubreddit';
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
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
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
      {/* mini create post */}
      <MiniPostSubreddit />
      {/* todo: show posts in the feed */}
    </>
  );
};

export default Page;
