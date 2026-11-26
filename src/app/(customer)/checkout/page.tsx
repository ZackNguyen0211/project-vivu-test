// src/app/(customer)/checkout/page.tsx
import React from "react";
import CheckoutPaymentClient from "@/components/checkout/CheckoutPaymentClient";

export const instant = false;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{
    tripId?: string;
    seats?: string;
    pickup?: string;
    dropoff?: string;
    amount?: string;
  }>;
}) {
  const resolved = await searchParams;
  const seatList = resolved.seats ? resolved.seats.split(",").filter(Boolean) : [];
  const amount = resolved.amount ? Number(resolved.amount) : 900000;

  return (
    <CheckoutPaymentClient
      tripId={resolved.tripId || ""}
      seatList={seatList}
      pickupStopId={resolved.pickup || ""}
      dropoffStopId={resolved.dropoff || ""}
      amount={amount}
    />
  );
}