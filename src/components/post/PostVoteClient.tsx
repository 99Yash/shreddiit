'use client'

import { useCustomToast } from '@/hooks/use-custom-toast';
import { usePrevious } from '@mantine/hooks';
import { VoteType } from '@prisma/client';
import React, { FC, useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { PostVoteRequest } from '@/lib/validators/vote';
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';

interface PostVoteClient {
  postId: string;
  initialVotes: number;
  initialVote?: VoteType | null;
}

const PostVoteClient: FC<PostVoteClient> = ({
  postId,
  initialVotes,
  initialVote,
}) => {
  const { loginToast } = useCustomToast();
  const [votes, setVotes] = useState<number>(initialVotes);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType,
      };

      await axios.patch(`/api/subreddit/post/vote`, payload);
    },
    onError: (err, voteType) => {
      voteType === 'UP'
        ? setVotes((prev) => prev - 1)
        : setVotes((prev) => prev + 1);

      setCurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    },
    onMutate: (type: VoteType) => {
      //optimistic updates
      currentVote === type ? setCurrentVote(undefined) : setCurrentVote(type);
      currentVote === type && type === 'UP' && setVotes((prev) => prev - 1);
      currentVote === type && type === 'DOWN' && setVotes((prev) => prev + 1);

      currentVote !== type ? setCurrentVote(type) : setCurrentVote(undefined);
      currentVote !== type &&
        type === 'UP' &&
        setVotes((prev) => (currentVote ? prev + 2 : prev + 1));
      currentVote !== type &&
        type === 'DOWN' &&
        setVotes((prev) => (currentVote ? prev - 2 : prev - 1));
    },
  });

  return (
    <div className="flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0 ">
      <Button
        onClick={() => vote('UP')}
        size={'sm'}
        variant={'ghost'}
        aria-label="upvote"
      >
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'text-emerald-500 fill-emerald-500 ': currentVote === 'UP',
          })}
        />
      </Button>

      <p className="text-center py-2 font-medium text-sm text-zinc-900 ">
        {votes}
      </p>

      <Button
        onClick={() => vote('DOWN')}
        size={'sm'}
        variant={'ghost'}
        aria-label="upvote"
      >
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'text-red-500 fill-red-500 ': currentVote === 'DOWN',
          })}
        />
      </Button>
    </div>
  );
};

export default PostVoteClient;
