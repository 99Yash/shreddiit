import { Comment, Post, Subreddit, Vote } from '@prisma/client';

export type ExtendedPost = Post & {
  subreddit: Subreddit;
  votes: Vote[];
  comments: Comment[];
};
