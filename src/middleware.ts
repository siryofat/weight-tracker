import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export default clerkMiddleware(async (auth, request, next) => {
  const publicRoutes = ['/sign-in', '/sign-up', '/sign-in/*', '/sign-up/*'];
  if (publicRoutes.some(route => request.nextUrl.pathname.match(new RegExp(`^${route.replace('*', '.*')}$`)))) {
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
