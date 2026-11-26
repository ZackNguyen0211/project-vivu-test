// src/app/(customer)/bookings/[code]/page.tsx
import React from "react";
import { getElectronicTicketByCode } from "@/services/booking.service";
import ElectronicTicketClient from "@/components/ticket/ElectronicTicketClient";

export const instant = false;

export default async function BookingTicketPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const ticket = await getElectronicTicketByCode(code);

  return <ElectronicTicketClient ticket={ticket} />;
}