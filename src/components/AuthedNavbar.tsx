'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useClerk } from '@clerk/nextjs';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { Avatar, AvatarImage } from './ui/avatar';
const AuthedNavbar = () => {
  const { user } = useClerk();
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
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user?.firstName && <p className="font-medium">{user.firstName}</p>}
            {user?.primaryEmailAddress && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthedNavbar;
