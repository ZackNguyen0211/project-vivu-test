// src/app/operator/trips/page.tsx
import React from "react";
import { getOperatorScheduleTrips } from "@/services/operator.service";
import OperatorTripsClient from "@/components/operator/OperatorTripsClient";

export const instant = false;

export default async function OperatorTripsPage() {
  const trips = await getOperatorScheduleTrips();
  return <OperatorTripsClient initialTrips={trips} />;
}