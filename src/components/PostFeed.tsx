'use client';
import { ExtendedPost } from '@/types/db';
import React, { useRef } from 'react';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/siteConfig';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import Post from './Post';

const PostFeed = ({
  initialPosts,
  subredditName,
}: {
  initialPosts: ExtendedPost[];
  subredditName?: string;
}) => {
  const { userId } = useAuth();
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['infiniteQuery'],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : '');

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_lastPage, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pages: [initialPosts],
        pageParams: [1],
      },
    }
  );

  const posts = data?.pages.flatMap((page) => page) ?? [];

  return (
    <ul className=" flex flex-col col-span-2 space-y-6 ">
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.voteType === 'UP') return acc + 1;
          if (vote.voteType === 'DOWN') return acc - 1;
          return acc;
        }, 0);

        const currentVote = post.votes.find((vote) => vote.userId === userId);

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                currentVote={currentVote}
                votesAmt={votesAmt}
                commentAmt={post.comments.length}
                post={post}
                subredditName={post.subreddit.name}
              />
            </li>
          );
        } else {
          return (
            <Post
              currentVote={currentVote}
              votesAmt={votesAmt}
              commentAmt={post.comments.length}
              post={post}
              key={post.id}
              subredditName={post.subreddit.name}
            />
          );
        }
      })}
    </ul>
  );
};

export default PostFeed;
