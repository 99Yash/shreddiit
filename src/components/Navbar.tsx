'use client';

import Link from 'next/link';
import { Icons } from './Icons';
import { buttonVariants } from './ui/Button';
import { useAuth } from '@clerk/nextjs';
import AuthedNavbar from './AuthedNavbar';

const Navbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-10 py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2 ">
        <Link href={'/'} className="flex gap-2 items-center">
          <Icons.commentReply className="h-8 w-8 bg-slate-50 text-green-300 sm:h-6 sm:w-6" />
          <p className="hidden text-zinc-700 text-sm font-medium md:block  ">
            Shreddit
          </p>
        </Link>

        {!isSignedIn ? (
          <Link href={'/sign-in'} className={buttonVariants()}>
            Sign In
          </Link>
        ) : (
          <AuthedNavbar />
        )}
      </div>
    </div>
  );
};

export default Navbar;
