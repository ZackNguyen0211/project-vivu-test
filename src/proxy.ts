import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const publicConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (!publicConfig.url || !publicConfig.anonKey) {
    return response;
  }

  const supabase = createServerClient(publicConfig.url, publicConfig.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isBookingFlow =
    pathname.startsWith("/trips/") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/bookings/") ||
    pathname.startsWith("/me/");
  const isAdminRoute = pathname.startsWith("/admin/");
  const isOperatorRoute = pathname.startsWith("/operator/");
  const isProtectedDashboard = isAdminRoute || isOperatorRoute;

  if ((isBookingFlow || isProtectedDashboard) && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if (!user) {
    return response;
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role || "USER";

  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  if (isOperatorRoute && role !== "OPERATOR") {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/trips/:path*",
    "/checkout",
    "/bookings/:path*",
    "/me/:path*",
    "/admin/:path*",
    "/operator/:path*",
  ],
};
