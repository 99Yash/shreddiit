import Link from 'next/link';
import OAuthSignIn from './auth/oauth-signin';

const SignIn = () => {
  return (
    <div className="container rounded-md p-8 mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] ">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-sm max-w-xs mx-auto">
          Choose your preferred sign in method
        </p>
      </div>
      <OAuthSignIn />

      <p className="px-8 text-center text-sm text-zinc-700 hover:text-zinc-900">
        Don&apos;t have an account?{' '}
        <Link
          aria-label="Sign up"
          href="/sign-up"
          className="text-primary  underline-offset-4 transition-colors hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
