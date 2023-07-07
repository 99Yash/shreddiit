import { z } from 'zod';

export const commentValidator = z.object({
  postId: z.string(),
  text: z.string(),
  replyToId: z.string().optional(),
});

export type CommentReq = z.infer<typeof commentValidator>;
