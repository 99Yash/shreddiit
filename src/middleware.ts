import { clerkClient } from '@clerk/nextjs';
import { authMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default authMiddleware({
  // Public routes are routes that don't require authentication
  publicRoutes: ['/', '/sign-in(.*)', '/sign-up(.*)', '/sso-callback(.*)'],
  async afterAuth(auth, req) {
    if (auth.isPublicRoute) {
      //  For public routes, we don't need to do anything
      return NextResponse.next();
    }
    const url = new URL(req.nextUrl.origin);

    if (!auth.userId) {
      // if user tries to access protected route, redirect to sign in
      url.pathname = '/sign-in';
      return NextResponse.redirect(url);
    }

    const user = await clerkClient.users.getUser(auth.userId);

    if (!user) throw new Error('User not found');
  },
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)'],
};
