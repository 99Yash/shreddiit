'use client';

import { useRef, useState } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Comment, CommentVote } from '@prisma/client';
import { formatTimeToNow } from '@/lib/utils';
import CommentVotes from './CommentVotes';
import { Button } from './ui/Button';
import { MessageSquare } from 'lucide-react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { CommentReq } from '@/lib/validators/comment';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type ExtendComment = Comment & {
  votes: CommentVote[];
};

const PostComment = ({
  comment,
  votesAmt,
  currentVote,
  postId,
}: {
  comment: ExtendComment;
  votesAmt: number;
  currentVote: CommentVote | undefined;
  postId: string;
}) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const [isReplying, setIsReplying] = useState(false);
  const [input, setInput] = useState('');
  const router = useRouter();

  const { mutate: postReply, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentReq) => {
      const payload: CommentReq = {
        postId,
        text,
        replyToId,
      };
      const { data } = await axios.patch(
        `/api/subreddit/post/comment`,
        payload
      );
      return data as string;
    },
    onSuccess: () => {
      router.refresh();
      setInput('');
      setIsReplying(false);
    },
    onError: () => {
      return toast({
        title: 'There was a problem.',
        description: 'Comment could not be posted. Please try again.',
        variant: 'destructive',
      });
    },
  });

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

      <div className="flex gap-2 items-center flex-wrap ">
        <CommentVotes
          commentId={comment.id}
          initialVotes={votesAmt}
          initialVote={currentVote}
        />

        <Button
          onClick={() => {
            setIsReplying(true);
          }}
          variant={'ghost'}
          size={'xs'}
        >
          <MessageSquare className="h-4 w-4 mr-1.5" />
          Reply
        </Button>
        {isReplying && (
          <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">Your comment</Label>
            <div className="mt-2">
              <Textarea
                id="comment"
                value={input}
                rows={1}
                placeholder="What's your thoughts on this?"
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="mt-2 flex justify-end gap-2 ">
                <Button
                  tabIndex={-1}
                  variant={'subtle'}
                  onClick={() => {
                    setIsReplying(false);
                    setInput('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  isLoading={isLoading}
                  disabled={input.length === 0}
                  onClick={() => {
                    if (!input) return;
                    postReply({
                      postId,
                      text: input,
                      replyToId: comment.replyToId ?? comment.id,
                    });
                  }}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostComment;
