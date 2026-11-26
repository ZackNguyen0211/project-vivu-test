// src/components/seats/SeatSelectionClient.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SeatCell, TripSearchResult } from "@/types/booking";
import BookingStepHeader from "@/components/layout/BookingStepHeader";

interface SeatSelectionClientProps {
  trip: TripSearchResult;
  seats: SeatCell[];
}

export default function SeatSelectionClient({
  trip,
  seats,
}: SeatSelectionClientProps) {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [pickupStopId, setPickupStopId] = useState<string>(
    trip.pickup_stops[0]?.id || ""
  );
  const [dropoffStopId, setDropoffStopId] = useState<string>(
    trip.dropoff_stops[0]?.id || ""
  );

  const toggleSeat = (seat: SeatCell) => {
    if (seat.state !== "AVAILABLE") return;
    setSelectedSeats((prev) =>
      prev.includes(seat.seat_code)
        ? prev.filter((c) => c !== seat.seat_code)
        : prev.length < 5
        ? [...prev, seat.seat_code]
        : prev
    );
  };

  const totalPrice = selectedSeats.length * trip.ticket_price;

  const handleProceedCheckout = () => {
    if (selectedSeats.length === 0) return;
    const query = new URLSearchParams({
      tripId: trip.id,
      seats: selectedSeats.join(","),
      pickup: pickupStopId,
      dropoff: dropoffStopId,
      amount: String(totalPrice),
    });
    router.push(`/checkout?${query.toString()}`);
  };

  const deck1Seats = seats.filter((s) => s.deck === 1);
  const deck2Seats = seats.filter((s) => s.deck === 2);

  return (
    <div className="min-h-screen bg-surface pb-16">
      <BookingStepHeader
        currentStep={2}
        routeTitle={`${trip.departure_province} ➔ ${trip.destination_province} (${trip.operator_name})`}
        dateLabel={`${trip.departure_time} • ${trip.departure_date}`}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cột Trái: Sơ đồ ghế 2 tầng & Điểm đón trả */}
        <div className="lg:col-span-8 space-y-6">
          {/* Chú thích trạng thái ghế (Seat Legend) */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/25 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-5 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md border-2 border-[#1E3E62] bg-white inline-block" />
                <span>Ghế trống ({trip.ticket_price / 1000}k)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-secondary-container border-2 border-amber-600 inline-block" />
                <span>Đang chọn</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-100 border border-amber-400 inline-block" />
                <span>Khách khác đang giữ (10p)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-slate-200 border border-slate-300 inline-block" />
                <span>Đã đặt</span>
              </div>
            </div>
            <span className="text-xs font-bold text-secondary">
              Tối đa 5 ghế / giao dịch
            </span>
          </div>

          {/* Sơ đồ 2 tầng trực quan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "TẦNG 1 (TẦNG DƯỚI - DÃY A)", list: deck1Seats },
              { title: "TẦNG 2 (TẦNG TRÊN - DÃY B)", list: deck2Seats },
            ].map((deck) => (
              <div
                key={deck.title}
                className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30"
              >
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-surface-container">
                  <span className="font-display text-sm font-extrabold text-primary-container">
                    {deck.title}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant">
                    steering_wheel_heat
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3.5 max-w-[260px] mx-auto">
                  {deck.list.map((seat) => {
                    const isSelected = selectedSeats.includes(seat.seat_code);
                    const isOccupied = seat.state === "OCCUPIED";
                    const isLocked = seat.state === "LOCKED_PENDING";

                    return (
                      <button
                        key={seat.seat_code}
                        type="button"
                        disabled={isOccupied || isLocked}
                        onClick={() => toggleSeat(seat)}
                        className={`h-16 rounded-xl p-2.5 flex flex-col justify-between transition-all text-left relative ${
                          isOccupied
                            ? "bg-slate-200 border border-slate-300 text-slate-400 cursor-not-allowed"
                            : isLocked
                            ? "bg-amber-50 border border-amber-300 text-amber-800 cursor-not-allowed"
                            : isSelected
                            ? "bg-secondary-container border-2 border-amber-600 text-primary-container shadow-md scale-[1.02] cursor-pointer"
                            : "bg-white border-2 border-[#1E3E62] text-primary-container hover:border-[#00B4D8] hover:bg-sky-50/40 cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-display text-sm font-extrabold">
                            {seat.seat_code}
                          </span>
                          <span className="material-symbols-outlined text-base">
                            {isOccupied
                              ? "lock"
                              : isLocked
                              ? "hourglass_top"
                              : isSelected
                              ? "check_circle"
                              : "airline_seat_flat"}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold truncate">
                          {isOccupied
                            ? "Đã bán"
                            : isLocked
                            ? "Đang giữ 10p"
                            : `${seat.price / 1000}k • Phòng VIP`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Chọn Điểm Đón & Điểm Trả */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-display text-sm font-bold text-on-surface flex items-center gap-1.5 mb-3">
                <span className="material-symbols-outlined text-secondary-container text-lg">
                  radio_button_checked
                </span>
                Điểm đón khách ({trip.departure_province})
              </h3>
              <div className="space-y-2.5">
                {trip.pickup_stops.map((stop) => (
                  <label
                    key={stop.id}
                    className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                      pickupStopId === stop.id
                        ? "border-secondary-container bg-secondary-fixed/30"
                        : "border-outline-variant/30 hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="pickup"
                        checked={pickupStopId === stop.id}
                        onChange={() => setPickupStopId(stop.id)}
                      />
                      <span className="font-display text-sm font-bold text-primary-container">
                        {stop.time_label} • {stop.station_name}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 pl-6">
                      {stop.address}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display text-sm font-bold text-on-surface flex items-center gap-1.5 mb-3">
                <span className="material-symbols-outlined text-error text-lg">
                  location_on
                </span>
                Điểm trả khách ({trip.destination_province})
              </h3>
              <div className="space-y-2.5">
                {trip.dropoff_stops.map((stop) => (
                  <label
                    key={stop.id}
                    className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                      dropoffStopId === stop.id
                        ? "border-secondary-container bg-secondary-fixed/30"
                        : "border-outline-variant/30 hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="dropoff"
                        checked={dropoffStopId === stop.id}
                        onChange={() => setDropoffStopId(stop.id)}
                      />
                      <span className="font-display text-sm font-bold text-primary-container">
                        {stop.time_label} • {stop.station_name}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 pl-6">
                      {stop.address}
                    </p>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cột Phải: Tóm tắt đơn đặt vé Sticky */}
        <div className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md border border-outline-variant/30 sticky top-24 space-y-5">
            <div className="pb-4 border-b border-surface-container">
              <span className="text-xs font-bold text-secondary uppercase">
                Tóm tắt giữ chỗ
              </span>
              <h3 className="font-display text-lg font-bold text-on-surface mt-0.5">
                {trip.operator_name}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                {trip.coach_type_label} • Biển số {trip.license_plate}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Tuyến đường:</span>
                <span className="font-bold text-on-surface">
                  {trip.departure_province} ➔ {trip.destination_province}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Giờ xuất bến:</span>
                <span className="font-bold text-on-surface">
                  {trip.departure_time} ({trip.departure_date})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">
                  Ghế đang chọn ({selectedSeats.length}):
                </span>
                <div className="flex gap-1.5 flex-wrap justify-end">
                  {selectedSeats.length > 0 ? (
                    selectedSeats.map((code) => (
                      <span
                        key={code}
                        className="px-2.5 py-0.5 rounded bg-secondary-container text-primary-container font-display font-extrabold"
                      >
                        {code}
                      </span>
                    ))
                  ) : (
                    <span className="text-error font-semibold">
                      Chưa chọn ghế
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-surface-container flex items-baseline justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase">
                Tổng cộng tạm tính
              </span>
              <span className="font-display text-2xl font-extrabold text-primary-container tabular-nums">
                {new Intl.NumberFormat("vi-VN").format(totalPrice)}₫
              </span>
            </div>

            <button
              type="button"
              disabled={selectedSeats.length === 0}
              onClick={handleProceedCheckout}
              className="w-full py-4 rounded-xl bg-secondary-container hover:bg-secondary hover:text-white disabled:opacity-50 text-primary-container font-display text-sm font-extrabold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>TIẾP TỤC THANH TOÁN</span>
              <span className="material-symbols-outlined text-lg">
                arrow_forward
              </span>
            </button>

            <p className="text-[11px] text-on-surface-variant text-center leading-relaxed">
              Hệ thống sẽ tạo lệnh khóa ghế tạm thời <strong>10 phút</strong>{" "}
              (`status = PENDING`) ngay khi bạn chuyển sang bước thanh toán.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}