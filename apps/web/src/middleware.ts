import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that should be accessible without authentication
const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/legal/terms",
  "/legal/privacy",
];

// API paths that should always be accessible
const API_PATHS = [
  "/api/v1/auth/refresh",
  "/api/v1/auth/validate",
  "/api/v1/auth/logout",
];

// Add paths that should always redirect to dashboard if authenticated
const authPaths = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow API auth endpoints
  if (API_PATHS.some((path) => pathname.endsWith(path))) {
    return NextResponse.next();
  }

  // Check if the path is public
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith("/api/")
  );

  // Check if the path is an auth path (login/register)
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // Get the token from the cookies
  const token = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // If the user is authenticated and tries to access auth pages, redirect to dashboard
  if ((token || refreshToken) && isAuthPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the path is not public and user is not authenticated, redirect to login
  if (!isPublicPath && !token && !refreshToken) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", encodeURIComponent(pathname));
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
