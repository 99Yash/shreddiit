'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useClerk } from '@clerk/nextjs';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { Avatar, AvatarImage } from './ui/avatar';
import { LogOut, UserPlus } from 'lucide-react';
import Link from 'next/link';

export const AuthedNavbar = () => {
  const { user, signOut } = useClerk();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={user?.profileImageUrl}
            alt={user?.firstName || 'User'}
          />
          <AvatarFallback>
            {user?.firstName?.charAt(0).toUpperCase()}
            {user?.lastName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user?.fullName && <p className="font-medium">{user.fullName}</p>}
            {user?.primaryEmailAddress && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <UserPlus className="mr-2 h-4 w-4" />
          <Link href={'/r/create'} className="font-medium">
            Create Community
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            signOut();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="font-medium">Log out</span>
          <DropdownMenuShortcut className="font-black">
            ⇧⌘Q
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
