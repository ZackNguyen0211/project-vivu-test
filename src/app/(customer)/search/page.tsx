// src/app/(customer)/search/page.tsx
import React, { Suspense } from "react";
import { searchAvailableTrips } from "@/services/booking.service";
import SearchScheduleClient from "@/components/search/SearchScheduleClient";

type SearchParamsType = Promise<{ from?: string; to?: string; date?: string }>;

export const instant = false;

async function SearchResults({
  searchParams,
}: {
  searchParams: SearchParamsType;
}) {
  const resolved = await searchParams;
  const fromCity = resolved.from || "TP. Hồ Chí Minh";
  const toCity = resolved.to || "Đà Lạt (Lâm Đồng)";
  const dateStr = resolved.date || "2026-11-20";

  const trips = await searchAvailableTrips({
    from: fromCity,
    to: toCity,
    date: dateStr,
  });

  return (
    <SearchScheduleClient
      initialTrips={trips}
      fromCity={fromCity}
      toCity={toCity}
      dateStr={dateStr}
    />
  );
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: SearchParamsType;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-sm font-medium text-on-surface-variant">
          Đang tải danh sách chuyến xe...
        </div>
      }
    >
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}