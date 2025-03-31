import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",          // Home page
    "/sign-in",   // Sign-in page
    "/sign-up",    // Sign-up page
    "/pricing",   // Pricing page
    "/docs",      // Docs page
  ],
  afterAuth(auth, req, evt) {
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return Response.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: [
    "/dashboard",   // Protect dashboard
    "/customize",   // Protect customize
    "/templates",   // Protect templates
    "/guidelines",  // Protect guidelines
    "/success",     // Protect success
    "/preview",     // Protect preview
    "/templates",   // Protect templates
    "/history",     // Protect history
    "/users",       // Protect users page
    "/telegram/(.*)",  // Protect telegram routes
    "/api/(.*)"     // Protect all API routes if needed
  ],
};
