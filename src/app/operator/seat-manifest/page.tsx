// src/app/operator/seat-manifest/page.tsx
import React from "react";
import { getTripManifestPassengers } from "@/services/operator.service";
import SeatManifestClient from "@/components/operator/SeatManifestClient";

export const instant = false;

export default async function SeatManifestPage() {
  const passengers = await getTripManifestPassengers("trip-op-1");
  return <SeatManifestClient initialPassengers={passengers} />;
}