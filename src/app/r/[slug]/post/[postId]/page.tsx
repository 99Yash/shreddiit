import CommentSection from '@/components/CommentSection';
import EditorOutput from '@/components/EditorOutput';
import PostVoteServer from '@/components/post/PostVoteServer';
import { buttonVariants } from '@/components/ui/Button';
import { db } from '@/lib/db';
import { formatTimeToNow } from '@/lib/utils';
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const page = async ({
  params,
}: {
  params: {
    postId: string;
  };
}) => {
  const post = await db.post.findFirst({
    where: {
      id: params.postId,
    },
    include: {
      votes: true,
    },
  });

  if (!post) return notFound();

  return (
    <div className="">
      <div className="h-full flex flex-col items-center sm:items-start sm:flex-row justify-between ">
        <Suspense fallback={<PostVoteShell />}>
          {/* @ts-expect-error server component  */}
          <PostVoteServer
            postId={post.id}
            getData={async () => {
              const post = await db.post.findUnique({
                where: {
                  id: params.postId,
                },
                include: {
                  votes: true,
                },
              });
              return post;
            }}
          />
        </Suspense>

        <div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm ">
          <p className=" max-h-40 mt-1 truncate text-xs text-gray-500 ">
            Posted by u/{post.authorId}{' '}
            {formatTimeToNow(new Date(post.createdAt))}
          </p>
          <h1 className="text-xl font-semibold py-4 leading-6 text-gray-900">
            {post.title}
          </h1>
          <EditorOutput content={post.content} />

          <Suspense
            fallback={
              <Loader2 className="h-5 w-5 animate-spin text-zinc-700" />
            }
          >
            {/* @ts-expect-error server component */}
            <CommentSection postId={post.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

function PostVoteShell() {
  return (
    <div className="flex items-center flex-col pr-6 w-20">
      <div
        className={buttonVariants({
          variant: 'ghost',
        })}
      >
        <ArrowBigUp className="h-5 w-5 text-zinc-700" />
      </div>

      <div className="text-center py-2 font-medium text-sm text-gray-900 ">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      <div
        className={buttonVariants({
          variant: 'ghost',
        })}
      >
        <ArrowBigDown className="h-5 w-5 text-zinc-700" />
      </div>
    </div>
  );
}

export default page;
