import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.next();
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const seatCodes = Array.isArray(body.seatCodes)
    ? [...new Set(body.seatCodes.map((seat: unknown) => String(seat).trim()).filter(Boolean))]
    : [];

  const { data, error } = await supabase.rpc("create_pending_booking", {
    p_trip_id: body.tripId,
    p_seat_codes: seatCodes,
    p_customer_name: body.customerName,
    p_customer_phone: body.customerPhone,
    p_customer_email: body.customerEmail,
    p_pickup_stop_id: body.pickupStopId || null,
    p_dropoff_stop_id: body.dropoffStopId || null,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 409 }
    );
  }

  return NextResponse.json(data);
}
