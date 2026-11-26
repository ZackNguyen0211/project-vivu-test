// src/components/search/SearchScheduleClient.tsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { CoachLayoutType, TripSearchResult } from "@/types/booking";
import BookingStepHeader from "@/components/layout/BookingStepHeader";

interface SearchScheduleClientProps {
  initialTrips: TripSearchResult[];
  fromCity: string;
  toCity: string;
  dateStr: string;
}

function formatSearchDate(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? dateStr
    : new Intl.DateTimeFormat("vi-VN", { dateStyle: "long" }).format(date);
}

export default function SearchScheduleClient({
  initialTrips,
  fromCity,
  toCity,
  dateStr,
}: SearchScheduleClientProps) {
  const [selectedCoachTypes, setSelectedCoachTypes] = useState<CoachLayoutType[]>([]);
  const [timeSlot, setTimeSlot] = useState<"ALL" | "MORNING" | "NIGHT">("ALL");
  const [sortBy, setSortBy] = useState<"TIME_ASC" | "PRICE_ASC" | "RATING_DESC">("TIME_ASC");
  const formattedDate = useMemo(() => formatSearchDate(dateStr), [dateStr]);

  const toggleCoachType = (type: CoachLayoutType) => {
    setSelectedCoachTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filteredTrips = useMemo(() => {
    return initialTrips
      .filter((trip) => {
        if (
          selectedCoachTypes.length > 0 &&
          !selectedCoachTypes.includes(trip.coach_type)
        ) {
          return false;
        }
        const hour = parseInt(trip.departure_time.split(":")[0], 10);
        if (timeSlot === "MORNING" && hour >= 18) return false;
        if (timeSlot === "NIGHT" && hour < 18) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "PRICE_ASC") return a.ticket_price - b.ticket_price;
        if (sortBy === "RATING_DESC") return b.operator_rating - a.operator_rating;
        return a.departure_time.localeCompare(b.departure_time);
      });
  }, [initialTrips, selectedCoachTypes, timeSlot, sortBy]);

  return (
    <div className="min-h-screen bg-surface pb-16">
      <BookingStepHeader
        currentStep={1}
        routeTitle={`${fromCity} ➔ ${toCity}`}
        dateLabel={`Ngày đi: ${dateStr}`}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Bộ Lọc */}
        <aside className="lg:col-span-3 space-y-5">
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/25">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <span className="font-display text-sm font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-lg">
                  tune
                </span>
                Bộ lọc chuyến xe
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedCoachTypes([]);
                  setTimeSlot("ALL");
                }}
                className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
              >
                Đặt lại
              </button>
            </div>

            {/* Khung giờ xuất bến */}
            <div className="mt-4">
              <span className="text-xs font-bold text-on-surface-variant uppercase block mb-2.5">
                Giờ khởi hành
              </span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { key: "ALL", label: "Tất cả khung giờ (00:00 - 24:00)" },
                  { key: "MORNING", label: "Chuyến ban ngày (05:00 - 17:59)" },
                  { key: "NIGHT", label: "Chuyến ban đêm VIP (18:00 - 23:59)" },
                ].map((slot) => (
                  <button
                    key={slot.key}
                    type="button"
                    onClick={() => setTimeSlot(slot.key as typeof timeSlot)}
                    className={`px-3 py-2 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer ${
                      timeSlot === slot.key
                        ? "bg-secondary-fixed/50 border-secondary-container text-on-secondary-fixed"
                        : "border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low"
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Loại xe cố định (Theo chuẩn JSON Layout) */}
            <div className="mt-5 pt-4 border-t border-surface-container">
              <span className="text-xs font-bold text-on-surface-variant uppercase block mb-2.5">
                Dòng xe (Seat Layout)
              </span>
              <div className="space-y-2 text-xs">
                {[
                  { type: "LIMOUSINE_22", label: "Limousine 22 Phòng VIP" },
                  { type: "SLEEPER_36", label: "Giường Nằm 34/36 Chỗ" },
                  { type: "SEATER_45", label: "Ghế Ngồi 45 Chỗ" },
                ].map((item) => (
                  <label
                    key={item.type}
                    className="flex items-center gap-2.5 cursor-pointer py-1"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCoachTypes.includes(
                        item.type as CoachLayoutType
                      )}
                      onChange={() =>
                        toggleCoachType(item.type as CoachLayoutType)
                      }
                      className="rounded text-secondary focus:ring-secondary-container"
                    />
                    <span className="font-medium text-on-surface">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Danh sách kết quả chuyến xe */}
        <div className="lg:col-span-9 space-y-4">
          {/* Thanh Sort */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-outline-variant/25 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-semibold text-on-surface">
              Tìm thấy{" "}
              <strong className="text-secondary">
                {filteredTrips.length} chuyến xe
              </strong>{" "}
              mở bán trực tuyến
            </span>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-on-surface-variant font-medium">
                Sắp xếp:
              </span>
              {[
                { key: "TIME_ASC", label: "Giờ chạy sớm nhất" },
                { key: "PRICE_ASC", label: "Giá thấp nhất" },
                { key: "RATING_DESC", label: "Đánh giá cao nhất" },
              ].map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSortBy(s.key as typeof sortBy)}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                    sortBy === s.key
                      ? "bg-primary-container text-on-primary"
                      : "bg-surface-container-low text-on-surface-variant"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {filteredTrips.length === 0 && (
            <div
              role="status"
              className="flex flex-col items-center rounded-2xl border border-outline-variant/25 bg-surface-container-lowest px-6 py-12 text-center shadow-xs"
            >
              <span className="material-symbols-outlined mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-low text-secondary text-3xl">
                event_busy
              </span>
              <h2 className="font-display text-lg font-bold text-on-surface">
                {initialTrips.length === 0
                  ? "Không có chuyến xe vào ngày này"
                  : "Không có chuyến xe phù hợp"}
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-on-surface-variant">
                {initialTrips.length === 0
                  ? `Hiện chưa có chuyến xe từ ${fromCity} đến ${toCity} vào ngày ${formattedDate}.`
                  : "Không có chuyến nào khớp với bộ lọc hiện tại. Hãy thử đổi khung giờ hoặc dòng xe."}
              </p>
              {initialTrips.length === 0 ? (
                <p className="mt-1 text-sm text-on-surface-variant">
                  Vui lòng chọn ngày khác hoặc điều chỉnh điểm đi và điểm đến.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCoachTypes([]);
                    setTimeSlot("ALL");
                  }}
                  className="mt-5 rounded-lg bg-primary-container px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container/90"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          )}

          {/* Danh sách Trip Cards */}
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs hover:shadow-md transition-all border border-outline-variant/30"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Zone 1: Timeline */}
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
                      {trip.coach_type_label}
                    </span>
                    <span className="text-xs font-bold text-on-surface flex items-center gap-1">
                      <span className="material-symbols-outlined material-symbols-filled text-secondary-container text-sm">
                        star
                      </span>
                      {trip.operator_rating} ({trip.operator_reviews})
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-on-surface">
                    {trip.operator_name}
                  </h3>

                  <div className="mt-4 flex items-center gap-4">
                    <div>
                      <span className="font-display text-2xl font-extrabold text-primary-container tabular-nums">
                        {trip.departure_time}
                      </span>
                      <span className="block text-xs text-on-surface-variant mt-0.5">
                        {trip.departure_station}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col items-center">
                      <span className="text-[11px] font-bold text-secondary">
                        {trip.duration_label}
                      </span>
                      <div className="w-full h-0.5 bg-outline-variant/50 my-1 relative">
                        <span className="w-2 h-2 rounded-full bg-secondary-container absolute -top-0.5 left-1/2 -translate-x-1/2" />
                      </div>
                      <span className="text-[10px] text-on-surface-variant">
                        Chạy thẳng cao tốc
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-display text-2xl font-extrabold text-primary-container tabular-nums">
                        {trip.arrival_time}
                      </span>
                      <span className="block text-xs text-on-surface-variant mt-0.5">
                        {trip.destination_station}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Zone 2: Tiện ích & Điểm đón trả */}
                <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l lg:border-r border-surface-container pt-4 lg:pt-0 lg:px-5">
                  <span className="text-xs font-bold text-on-surface-variant uppercase block mb-2">
                    Tiện ích trên chuyến ({trip.license_plate})
                  </span>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {trip.amenities.map((am) => (
                      <span
                        key={am}
                        className="px-2.5 py-1 rounded-md bg-surface-container-low text-on-surface text-[11px] font-medium"
                      >
                        {am}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      verified
                    </span>
                    Giữ chỗ 10 phút ngay khi bấm chọn ghế
                  </div>
                </div>

                {/* Zone 3: Giá vé & Nút Chọn Ghế */}
                <div className="lg:col-span-3 flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3">
                  <div className="text-left lg:text-right">
                    <span className="text-xs font-bold text-secondary block">
                      Còn {trip.available_seats}/{trip.total_seats} chỗ trống
                    </span>
                    <span className="font-display text-2xl font-extrabold text-primary-container tabular-nums block mt-0.5">
                      {new Intl.NumberFormat("vi-VN").format(trip.ticket_price)}₫
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      Giá đã bao gồm bảo hiểm
                    </span>
                  </div>

                  <Link
                    href={`/trips/${trip.id}/seats`}
                    className="px-6 py-3 rounded-xl bg-secondary-container hover:bg-secondary hover:text-white text-primary-container font-display text-sm font-bold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span>Chọn ghế</span>
                    <span className="material-symbols-outlined text-base">
                      event_seat
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}