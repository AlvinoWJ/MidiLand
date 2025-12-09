// proxy.ts — Next.js 16 replacement for middleware.ts

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// ==== ROUTES ====
const mainAppRoutes = ["/dashboard", "/input", "/status", "/profile"];

const guestRoutes = [
  "/auth/login",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/update-password",
  "/auth/error",
];

const completeProfileRoute = "/auth/complete-profile";

const utilityRoutes = ["/auth/callback", "/auth/sign-up-success"];

// ==== PROXY FUNCTION (required by Next.js 16) ====

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow system utility routes to pass through
  if (utilityRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // IMPORTANT: Must always start with NextResponse.next()
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Init Supabase Server Client with cookie sync
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Get user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isMainAppRoute = mainAppRoutes.some((r) => pathname.startsWith(r));
  const isGuestRoute = guestRoutes.some((r) => pathname.startsWith(r));
  const isProfileRoute = pathname.startsWith(completeProfileRoute);
  const isRootRoute = pathname === "/";

  // ==== LOGIN CHECK ====
  if (!session) {
    if (isMainAppRoute || isProfileRoute) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return response;
  }

  // ==== CHECK PROFILE COMPLETENESS ====
  const userId = session.user.id;

  const { data: profile } = await supabase
    .from("users_eksternal")
    .select("nama, no_telp, alamat")
    .eq("id", userId)
    .maybeSingle();

  const isProfileComplete = Boolean(
    profile?.nama && profile?.no_telp && profile?.alamat
  );

  // If user profile is COMPLETE
  if (isProfileComplete) {
    if (isGuestRoute || isProfileRoute || isRootRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  // If user profile is NOT COMPLETE
  else {
    if (isMainAppRoute || isGuestRoute || isRootRoute) {
      return NextResponse.redirect(new URL(completeProfileRoute, request.url));
    }
  }

  return response;
}

// ==== MATCHER SAME AS BEFORE ====
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
