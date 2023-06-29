import { authMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default authMiddleware({
  // Public routes are routes that don't require authentication
  publicRoutes: ['/', '/sign-in(.*)', '/sign-up(.*)', '/sso-callback(.*)'],
  async afterAuth(auth) {
    if (auth.isPublicRoute) {
      //  For public routes, we don't need to do anything
      return NextResponse.next();
    }
  },
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)'],
};
