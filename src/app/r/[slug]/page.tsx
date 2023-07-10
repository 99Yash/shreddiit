import MiniPostSubreddit from '@/components/MiniPostSubreddit';
import PostFeed from '@/components/PostFeed';
import { db } from '@/lib/db';
import {
  INFINITE_SCROLLING_PAGINATION_RESULTS,
  siteConfig,
} from '@/siteConfig';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: Props): Metadata {
  // read route params
  const slug = params.slug;

  return {
    title: `${slug} community on ${siteConfig.title}`,
    creator: `${siteConfig.authorName}`,
    openGraph: {
      type: 'website',
      title: `${slug} community on ${siteConfig.title}`,
      url: `${siteConfig.siteUrl}/r/${slug}`,
      description: `Posts on the ${slug} on ${siteConfig.title}`,
      locale: 'en_US',
    },
  };
}

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
