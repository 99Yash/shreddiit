'use client';

import { subscribeToSubredditPayload } from '@/lib/validators/subreddit';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Button } from './ui/Button';
import { toast } from '@/hooks/use-toast';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DM_Sans } from 'next/font/google';

const dm_sans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const ToggleSubscribe = ({
  subredditId,
  subredditName,
  isSubscribed,
}: {
  subredditId: string;
  isSubscribed: boolean;
  subredditName: string;
}) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubscriptionLoading } = useMutation({
    mutationFn: async () => {
      const payload: subscribeToSubredditPayload = {
        subredditId,
      };
      const { data } = await axios.post(`/api/subreddit/subscribe`, payload);
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
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
      });
      toast({
        title: 'Subscribed',
        description: `You are now subscribed to r/${subredditName}`,
      });
    },
  });
  const { mutate: unsubscribe, isLoading: isUnsubscribing } = useMutation({
    mutationFn: async () => {
      const payload: subscribeToSubredditPayload = {
        subredditId,
      };
      const { data } = await axios.post(`/api/subreddit/unsubscribe`, payload);
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
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
      });
      toast({
        title: 'Unsubscribed',
        description: `You have unsubscribed from r/${subredditName}`,
      });
    },
  });

  console.log(isSubscribed);
  return isSubscribed ? (
    <Button
      onClick={() => unsubscribe()}
      isLoading={isUnsubscribing}
      className="w-full mt-1 mb-4"
    >
      Leave Community
    </Button>
  ) : (
    <Button
      onClick={() => subscribe()}
      isLoading={isSubscriptionLoading}
      className="w-full mt-1 mb-4"
    >
      <span className={dm_sans.className}>Join to Post</span>
    </Button>
  );
};

export default ToggleSubscribe;
