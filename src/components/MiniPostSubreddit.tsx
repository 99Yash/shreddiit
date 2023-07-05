'use client';

import { useUser } from '@clerk/nextjs';
import { ImageIcon, Link2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';
import { Button } from './ui/Button';
import { Avatar, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';

const MiniPostSubreddit: FC = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { user } = useUser();
  return (
    <li className="overflow-hidden rounded-md bg-white shadow ">
      <div className="h-full px-6 py-4 flex justify-between gap-6 ">
        {user ? (
          <div className="relative">
            <Avatar>
              <AvatarImage
                src={user?.profileImageUrl}
                alt={user?.firstName || 'User'}
              />
            </Avatar>
            <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white "></span>
          </div>
        ) : (
          <div className="relative">
            <Skeleton className="h-12 w-12 rounded-full" />
            <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white "></span>
          </div>
        )}
        <Input
          readOnly
          onClick={() => router.push(pathName + '/submit')}
          placeholder="Create Post"
        />
        <Button
          variant={'ghost'}
          onClick={() => router.push(pathName + '/submit')}
        >
          <ImageIcon className="text-zinc-600" />
        </Button>
        <Button
          variant={'ghost'}
          onClick={() => router.push(pathName + '/submit')}
        >
          <Link2 className="text-zinc-600" />
        </Button>{' '}
      </div>
    </li>
  );
};

export default MiniPostSubreddit;
