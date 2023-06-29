import SignUp from '@/components/SignUp';
import { Shell } from '@/components/shell';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FC } from 'react';

const page: FC = () => {
  return (
    <Shell layout="auth">
      <div className="absolute bg-slate-200 inset-0">
        <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20 ">
          <Link
            href={'/'}
            className={
              (cn(
                buttonVariants({
                  variant: 'ghost',
                })
              ),
              'self-start -mt-20')
            }
          >
            Home
          </Link>
          <SignUp />
        </div>
      </div>
    </Shell>
  );
};

export default page;
