import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

// Routes where we must NOT apply the status redirect (avoids infinite loops)
const isBypassRoute = createRouteMatcher([
  "/pending(.*)",
  "/rejected(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
  "/_next(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  const { userId } = await auth();

  // Redirect already-authed users away from sign-in/sign-up
  if (userId && isPublicRoute(req) && req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Status check — only for logged-in users on non-bypass routes
  if (userId && !isBypassRoute(req)) {
    try {
      const statusUrl = new URL("/api/auth/status", req.url);
      const res = await fetch(statusUrl.toString(), {
        headers: { cookie: req.headers.get("cookie") ?? "" },
      });
      if (res.ok) {
        const { status } = await res.json() as { status: string };
        if (status === "pending") {
          return NextResponse.redirect(new URL("/pending", req.url));
        }
        if (status === "rejected") {
          return NextResponse.redirect(new URL("/rejected", req.url));
        }
      }
    } catch {
      // If the status check fails, allow the request through rather than blocking the user
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
