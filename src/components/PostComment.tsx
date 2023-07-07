'use client';

import { useRef } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Comment, CommentVote, Vote } from '@prisma/client';
import { formatTimeToNow } from '@/lib/utils';

type ExtendComment = Comment & {
  votes: CommentVote[];
};

const PostComment = ({ comment }: { comment: ExtendComment }) => {
  const commentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col" ref={commentRef}>
      <div className="flex items-center">
        <Avatar>
          <AvatarImage />
        </Avatar>

        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900 ">
            u/{comment.authorId}
          </p>
          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className="text-sm text-zinc-900 mt-2 ">{comment.text}</p>
    </div>
  );
};

export default PostComment;
