'use client';

import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { CommentReq } from '../lib/validators/comment';
import { Button } from './ui/Button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { useRouter } from 'next/navigation';

const CreateComment = ({
  postId,
  replyToId,
}: {
  postId: string;
  replyToId?: string;
}) => {
  const { loginToast } = useCustomToast();
  const [input, setInput] = useState('');
  const router = useRouter();

  const { mutate: comment, isLoading } = useMutation({
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
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: 'There was a problem.',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      router.refresh();
      setInput('');
    },
  });

  return (
    <div className="grid w-full gap-1.5 ">
      <Label htmlFor="comment">Your comment</Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          value={input}
          rows={1}
          placeholder="What's your thoughts on this?"
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="mt-2 flex justify-end ">
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() =>
              comment({
                postId,
                replyToId,
                text: input,
              })
            }
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
