// src/app/(customer)/trips/[tripId]/seats/page.tsx
import React, { Suspense } from "react";
import { getTripSeatMap } from "@/services/booking.service";
import SeatSelectionClient from "@/components/seats/SeatSelectionClient";

type ParamsType = Promise<{ tripId: string }>;

export const instant = false;

async function SeatSelectionContent({ params }: { params: ParamsType }) {
  const { tripId } = await params;
  const { trip, seats } = await getTripSeatMap(tripId);

  return <SeatSelectionClient trip={trip} seats={seats} />;
}

export default function TripSeatSelectionPage({
  params,
}: {
  params: ParamsType;
}) {
    return (
        <Suspense 
            fallback={
                <div className="min-h-[60vh] flex items-center justify-center text-sm font-medium text-on-surface-variant">
                    Đang tải sơ đồ ghế...
                </div>
            }
        >
            <SeatSelectionContent params={params} />
        </Suspense>
    );
}