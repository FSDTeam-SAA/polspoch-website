// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

type UserRole = "admin"| "user";

interface ProtectedRoute {
  prefix: string;
  roles: UserRole[]; // allowed roles for this prefix
}

// configure your protected prefixes and which roles may access them
const PROTECTED_ROUTES: ProtectedRoute[] = [
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/account", roles: ["user"] },
  // add more if needed: { prefix: "/dashboard", roles: ["organization"] }
];

function roleLanding(role?: string) {
  if (role === "admin") return "/admin";
  return "/account";
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // -------------- skip internals & auth endpoints --------------
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // -------------- read token (NextAuth) --------------
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const userRole = token?.role as UserRole | undefined;

  // -------------- redirect logged-in users away from /login --------------
  if (pathname === "/login") {
    if (token) {
      return NextResponse.redirect(new URL(roleLanding(userRole), req.url));
    }
    return NextResponse.next();
  }

  // -------------- check protected routes --------------
  for (const { prefix, roles } of PROTECTED_ROUTES) {
    if (pathname.startsWith(prefix)) {
      // not logged in → forced redirect to /login (so they cannot access the path)
      if (!token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // logged in → check role
      if (!userRole || !roles.includes(userRole)) {
        // not allowed → send to their landing page (or home if unknown)
        const landing = roleLanding(userRole);
        // avoid redirect loop: only redirect if not already hitting landing
        if (pathname !== landing) {
          return NextResponse.redirect(new URL(landing, req.url));
        }
        return NextResponse.redirect(new URL("/", req.url));
      }

      // allowed role → ok
      return NextResponse.next();
    }
  }

  // not a protected route → allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/login",
  ],
};
