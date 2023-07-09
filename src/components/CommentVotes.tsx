'use client';

import { Button } from '@/components/ui/Button';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CommentVoteRequest } from '@/lib/validators/vote';
import { usePrevious } from '@mantine/hooks';
import { CommentVote, VoteType } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { FC, useState } from 'react';

interface CommentVotes {
  commentId: string;
  initialVotes: number;
  initialVote?: PartialVote;
}

type PartialVote = Pick<CommentVote, 'voteType'>;
const CommentVotes: FC<CommentVotes> = ({
  commentId,
  initialVotes,
  initialVote,
}) => {
  const { loginToast } = useCustomToast();
  const [votes, setVotes] = useState<number>(initialVotes);
  const [currentVote, setCurrentVote] = useState<PartialVote | undefined>(
    initialVote
  );
  const prevVote = usePrevious(currentVote);

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType,
      };

      await axios.patch(`/api/subreddit/post/comment/vote`, payload);
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
    onMutate: (type) => {
      //optimistic updates
      if (currentVote?.voteType === type) {
        // User is voting the same way again, so remove their vote
        setCurrentVote(undefined);
        if (type === 'UP') setVotes((prev) => prev - 1);
        else if (type === 'DOWN') setVotes((prev) => prev + 1);
      } else {
        // User is voting in the opposite direction, so subtract 2
        setCurrentVote({ voteType: type });
        if (type === 'UP') setVotes((prev) => prev + (currentVote ? 2 : 1));
        else if (type === 'DOWN')
          setVotes((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });

  return (
    <div className="flex gap-1 ">
      <Button
        onClick={() => vote('UP')}
        size={'sm'}
        variant={'ghost'}
        aria-label="upvote"
      >
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'text-emerald-500 fill-emerald-500 ':
              currentVote?.voteType === 'UP',
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
            'text-red-500 fill-red-500 ': currentVote?.voteType === 'DOWN',
          })}
        />
      </Button>
    </div>
  );
};

export default CommentVotes;
