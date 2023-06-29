import React from 'react';
import OAuthSignIn from './auth/oauth-signin';
import Link from 'next/link';

const SignUp = () => {
  return (
    <div className="container rounded-md p-8 mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] ">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <p className="text-sm max-w-xs mx-auto">
          Choose your preferred sign up method
        </p>
      </div>
      <OAuthSignIn />

      <p className="px-8 text-center text-sm text-zinc-700 hover:text-zinc-900">
        Already have an account?{' '}
        <Link
          aria-label="Sign in"
          href="/sign-in"
          className="text-primary underline-offset-4 transition-colors hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
