import { z } from 'zod';

export const subredditValidator = z.object({
  name: z.string().min(3).max(21),
});

export const subredditSubscriptionValidator = z.object({
  subredditId: z.string(),
});

export type createSubredditPayload = z.infer<typeof subredditValidator>;
export type subscribeToSubredditPayload = z.infer<
  typeof subredditSubscriptionValidator
>;
