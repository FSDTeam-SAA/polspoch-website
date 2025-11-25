// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  // ------------------------------
  // 1) PROTECT /account ROUTES
  // ------------------------------
  if (pathname.startsWith("/account")) {
    if (!token) {
      // Not logged in → redirect to login
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // Logged in → OK
    return NextResponse.next();
  }

  // ------------------------------
  // 2) REDIRECT LOGGED-IN USERS AWAY FROM /login
  // ------------------------------
  if (pathname === "/login") {
    if (token) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*", // Matches all /account routes
    "/login",
  ],
};