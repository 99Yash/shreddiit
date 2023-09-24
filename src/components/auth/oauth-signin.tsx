'use client';

import { toast } from '@/hooks/use-toast';
import { isClerkAPIResponseError, useSignIn } from '@clerk/nextjs';
import { OAuthStrategy } from '@clerk/nextjs/dist/types/server';
import React from 'react';
import { Icons } from '../Icons';
import { Button } from '../ui/Button';

const OAuthSignIn = () => {
  const oauthProviders = [
    { name: 'Google', strategy: 'oauth_google', icon: 'google' },
    { name: 'Github', strategy: 'oauth_github', icon: 'gitHub' },
  ] satisfies {
    name: string;
    icon: keyof typeof Icons;
    strategy: OAuthStrategy;
  }[];
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const [isLoading, setIsLoading] = React.useState<OAuthStrategy | null>(null);

  async function oauthSignIn(provider: OAuthStrategy) {
    if (!signInLoaded) return null;
    try {
      setIsLoading(provider);
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      });
    } catch (error) {
      setIsLoading(null);
      const genericErr = 'Something went wrong, please try again.';

      isClerkAPIResponseError(error)
        ? toast({
            title: 'Error',
            description: error.errors[0]?.longMessage ?? genericErr,
            variant: 'destructive',
          })
        : toast({
            title: 'Error',
            description: genericErr,
            variant: 'destructive',
          });
    }
  }

  return (
    <div className={`grid grid-cols-1 gap-2 sm:grid-cols-${2} sm:gap-4`}>
      {oauthProviders.map((provider) => {
        const Icon = Icons[provider.icon];

        return (
          <Button
            aria-label={`Sign in with ${provider.name}`}
            key={provider.strategy}
            variant="outline"
            onClick={() => void oauthSignIn(provider.strategy)}
            className={`w-full hover:bg-slate-300/50 bg-background sm:w-auto ${
              isLoading === provider.strategy ? 'cursor-not-allowed' : ''
            }`}
            disabled={isLoading !== null}
          >
            {isLoading === provider.strategy ? (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {provider.name}
          </Button>
        );
      })}
    </div>
  );
};

export default OAuthSignIn;
