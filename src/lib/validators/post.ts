import { z } from 'zod';

export const postValidator = z.object({
  title: z
    .string()
    .min(3, {
      message: 'Title must be at least 3 characters long',
    })
    .max(124, {
      message: 'Title must be at most 124 characters long',
    }),
  subredditId: z.string(),
  content: z.any(),
});

export type PostCreationReq = z.infer<typeof postValidator>;
