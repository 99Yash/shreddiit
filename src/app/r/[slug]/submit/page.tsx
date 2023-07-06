import { Editor } from '@/components/Editor';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import React from 'react';

const page = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: params.slug,
    },
  });
  console.log('subreddit r/slug/submit', subreddit);
  if (!subreddit) return notFound();

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline ">
          <h3 className="ml-2 mt-2 text-lg leading-6 font-semibold text-gray-900">
            Create a Post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-gray-500">
            in r/{params.slug}
          </p>
        </div>
      </div>

      {/* form */}
      <Editor subredditId={subreddit.id} />

      <div className="w-full flex justify-end ">
        <Button className="w-full" form="subreddit-post-form" type="submit">
          Post
        </Button>
      </div>
    </div>
  );
};

export default page;
