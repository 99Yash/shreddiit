import React from 'react';
import { toast } from './use-toast';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/Button';

export const useCustomToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: 'Login required',
      description: 'You need be logged in.',
      variant: 'destructive',
      action: (
        <Link
          href={`/sign-in`}
          onClick={() => dismiss()}
          className={buttonVariants({
            variant: 'subtle',
            className: 'text-white ',
          })}
        >
          Login
        </Link>
      ),
    });
  };
  return { loginToast };
};
