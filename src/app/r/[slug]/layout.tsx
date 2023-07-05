import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { format } from 'date-fns';
import ToggleSubscribe from '@/components/ToggleSubscribe';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/Button';

const layout = async ({
  children,
  params: { slug },
}: {
  children: ReactNode;
  params: {
    slug: string;
  };
}) => {
  const user = await currentUser();
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  const subscription = await db.subscription.findFirst({
    where: {
      subreddit: {
        name: slug,
      },
      user: {
        clerkId: user?.id,
      },
    },
  });

  console.log('subscription', subscription);
  console.log('subreddit', subreddit);
  if (!subreddit) return notFound();
  const isSubscribed = !!subscription;

  const subredditMemberCount = await db.subscription.count({
    where: {
      subreddit: {
        name: slug,
      },
    },
  });
  console.log('subscriptionCount', subredditMemberCount);

  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12 ">
      <div className="">
        {/* todo button */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-4 py-6  ">
          <div className="flex flex-col col-span-2 space-y-6 ">{children}</div>

          {/* info sidebar */}
          <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last ">
            <div className="px-6 py-4 ">
              <p className="font-semibold py-3">About r/{subreddit.name}</p>
            </div>

            <dl className="divide-y divide-gray-200 px-6 py-4 text-sm leading-6 bg-white ">
              <div className="flex justify-between gap-x-4 py-3 ">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-700">
                  <time dateTime={new Date(subreddit.createdAt).toDateString()}>
                    {format(subreddit.createdAt, 'MMMM d, yyyy')}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3 ">
                <dt className="text-gray-500">Members</dt>
                <dd className="text-gray-900">{subredditMemberCount}</dd>
              </div>

              {subreddit.creatorId === user?.id ? (
                <div className="flex justify-between gap-x-4 py-3 ">
                  <p className="text-gray-500">You created this community</p>
                </div>
              ) : null}

              {/* community creator cant unsubscribe */}
              {subreddit.creatorId !== user?.id ? (
                <ToggleSubscribe
                  isSubscribed={isSubscribed}
                  subredditName={subreddit.name}
                  subredditId={subreddit.id}
                />
              ) : null}

              <Link
                href={`/r/${slug}/submit`}
                className={buttonVariants({
                  variant: 'outline',
                  className: 'w-full mb-6',
                })}
              >
                Create Post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default layout;
