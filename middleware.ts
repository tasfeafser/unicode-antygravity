import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  // All major pages are public so the demo works without login
  publicRoutes: [
    "/",
    "/ide",
    "/linux",
    "/security",
    "/docs",
    "/docs/(.*)",
    "/blog",
    "/blog/(.*)",
    "/legal/(.*)",
    "/billing",
    "/api/execute",
    "/api/stripe/webhook",
    "/api/support",
  ],
  afterAuth(auth, req) {
    // If not signed in and hitting a non-public protected route → redirect
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    return NextResponse.next();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
