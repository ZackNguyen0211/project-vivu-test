import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const redirect = request.nextUrl.searchParams.get("redirect");

  const response = NextResponse.redirect(
    new URL(redirect && redirect.startsWith("/") ? redirect : "/", request.url)
  );

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profile?.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url), {
          headers: response.headers,
        });
      }
      if (profile?.role === "OPERATOR") {
        return NextResponse.redirect(new URL("/operator/trips", request.url), {
          headers: response.headers,
        });
      }
    }
  }

  return response;
}
