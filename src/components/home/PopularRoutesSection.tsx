// src/components/home/PopularRoutesSection.tsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PopularRouteItem } from "@/types/home";

interface PopularRoutesSectionProps {
  initialRoutes: PopularRouteItem[];
}

const FILTER_TABS = [
  { key: "ALL", label: "Tất cả tuyến Hot" },
  { key: "TP. Hồ Chí Minh", label: "Từ TP. Hồ Chí Minh" },
  { key: "Hà Nội", label: "Từ Hà Nội" },
];

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h 00m`;
}

function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
}

export default function PopularRoutesSection({
  initialRoutes,
}: PopularRoutesSectionProps) {
  const [selectedTab, setSelectedTab] = useState<string>("ALL");

  const filteredRoutes = useMemo(() => {
    if (selectedTab === "ALL") return initialRoutes;
    return initialRoutes.filter((r) => r.departure_province === selectedTab);
  }, [initialRoutes, selectedTab]);

  return (
    <section className="w-full bg-surface-container-low py-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header & Filter Tabs */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 mb-9">
          <div>
            <span className="text-xs text-secondary uppercase font-bold tracking-wider">
              Hành trình trải nghiệm
            </span>
            <h2 className="font-display text-3xl lg:text-[2.25rem] font-bold text-on-surface mt-1 leading-tight">
              Tuyến đường phổ biến & Giá vé tốt nhất
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Được kiểm định chất lượng phương tiện êm ái, lộ trình chuẩn cao tốc
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-xl flex-wrap">
            {FILTER_TABS.map((tab) => {
              const active = selectedTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedTab(tab.key)}
                  className={`px-4 py-2.5 rounded-lg text-xs sm:text-[13px] transition-all cursor-pointer ${
                    active
                      ? "font-bold bg-surface-container-lowest text-primary-container shadow-xs"
                      : "font-medium text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Route Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route) => {
            const searchUrl = `/search?from=${encodeURIComponent(
              route.departure_province
            )}&to=${encodeURIComponent(route.destination_province)}`;

            return (
              <div
                key={route.id}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between border border-outline-variant/20"
              >
                {/* Card Top Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url('${route.image_url}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-container/85 via-transparent to-transparent" />

                  <span
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm ${
                      route.is_hot
                        ? "bg-secondary-container text-primary-container"
                        : "bg-surface-container-lowest/90 text-primary-container"
                    }`}
                  >
                    {route.is_hot && (
                      <span className="material-symbols-outlined text-sm">
                        trending_up
                      </span>
                    )}
                    {route.badge_text}
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 text-on-primary flex items-center justify-between">
                    <div>
                      <span className="text-xs text-surface-dim block">
                        Thời gian dự kiến
                      </span>
                      <span className="font-display text-sm font-bold">
                        {formatDuration(route.estimated_duration_minutes)} •{" "}
                        {route.highway_note}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-white/20 backdrop-blur-md text-xs font-bold">
                      {route.daily_trips_count} chuyến/ngày
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-lg sm:text-xl font-bold text-on-surface">
                        {route.departure_province} ⇄ {route.destination_province}
                      </h3>
                      <span className="text-xs text-secondary font-bold shrink-0">
                        {route.coach_label}
                      </span>
                    </div>

                    <p className="text-[13px] text-on-surface-variant mt-2 leading-relaxed">
                      {route.description}
                    </p>

                    <div className="flex items-center gap-3 mt-4 text-on-surface-variant text-xs flex-wrap">
                      {route.amenities.map((amenity) => (
                        <span
                          key={amenity.label}
                          className="inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm text-secondary-container">
                            {amenity.icon}
                          </span>
                          {amenity.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-6 pt-4 border-t border-surface-container flex items-center justify-between">
                    <div>
                      <span className="text-xs text-on-surface-variant block">
                        Giá vé niêm yết từ
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-xl font-extrabold text-primary-container tabular-nums">
                          {formatVnd(route.base_price)}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          / ghế
                        </span>
                      </div>
                    </div>

                    <Link
                      href={searchUrl}
                      className="min-h-[44px] px-5 py-2.5 rounded-xl bg-secondary-container hover:bg-secondary hover:text-white text-primary-container text-[13px] sm:text-sm font-bold transition-colors shadow-xs flex items-center justify-center gap-1"
                    >
                      <span>Đặt vé ngay</span>
                      <span className="material-symbols-outlined text-base">
                        chevron_right
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}