import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware((auth, request) => {
  console.log("Request: ", request.url);

  if (isPublicRoute(request)) {
    return;
  }
  // Check if user is authenticated but hasn't completed onboarding
  const { userId } = auth();

  if (userId && request.url.includes("/welcome")) {
    // You could add additional logic here to check if user needs onboarding
    return Response.redirect(new URL("/welcome", request.url));
  }

  if (!isPublicRoute(request)) {
    auth().protect();
  }
});
