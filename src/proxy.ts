import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Run on all routes except Next.js internals, static files, and unprotected API routes
    "/((?!_next/static|_next/image|favicon.ico|api/generate|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
