'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Prisma, Subreddit } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import debounce from 'lodash.debounce';
import Link from 'next/link';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState('');
  const pathname = usePathname();
  const commandRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const {
    data: queryResults,
    refetch,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      if (!searchInput) return [];

      const { data } = await axios.get(`/api/search?q=${searchInput}`);
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[];
    },
    queryKey: ['search-query'],
    enabled: false,
  });

  useEffect(() => {
    setSearchInput(``);
  }, [pathname]);

  const request = debounce(async () => {
    await refetch();
  }, 200);

  const debounceReq = useCallback(() => {
    request();

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useOnClickOutside(commandRef, () => {
    setSearchInput(``);
  });

  return (
    <Command
      ref={commandRef}
      className="relative rounded-lg bg-slate-50 border max-w-lg z-50 overflow-visible "
    >
      <CommandInput
        className="outline-none border-none focus:border-none focus:outline-none ring-0 "
        placeholder="Search communities..."
        value={searchInput}
        onValueChange={(value) => {
          setSearchInput(value);
          debounceReq();
        }}
      />

      {searchInput.length > 0 ? (
        <CommandList className="absolute bg-slate-50 top-full inset-x-0 shadow rounded-b-md ">
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="Communities">
              {queryResults?.map((subreddit) => (
                <CommandItem
                  value={subreddit.name}
                  key={subreddit.id}
                  onSelect={(e) => {
                    router.push(`/r/${e}`);
                    router.refresh();
                  }}
                >
                  <Users className="mr-2 h-4 w-4 " />
                  <Link href={`/r/${subreddit.name}`}>
                    r/{' '}
                    <span
                      className="font-semibold
                  "
                    >
                      {subreddit.name}
                    </span>
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  );
};

export default SearchBar;
