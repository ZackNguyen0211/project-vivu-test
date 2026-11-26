// src/components/layout/BookingStepHeader.tsx
import React from "react";
import Link from "next/link";

interface BookingStepHeaderProps {
  currentStep: 1 | 2 | 3 | 4;
  routeTitle?: string;
  dateLabel?: string;
}

const STEPS = [
  { step: 1, label: "1. Chọn chuyến xe", href: "/search" },
  { step: 2, label: "2. Chọn ghế & Điểm đón", href: "/trips/trip-futa-2200/seats" },
  { step: 3, label: "3. Thanh toán giữ chỗ", href: "/checkout" },
  { step: 4, label: "4. Vé điện tử QR", href: "/bookings/VVC-261118-8892" },
];

export default function BookingStepHeader({
  currentStep,
  routeTitle = "TP. Hồ Chí Minh ➔ Đà Lạt (Lâm Đồng)",
  dateLabel = "Thứ Sáu, 20/11/2026",
}: BookingStepHeaderProps) {
  return (
    <div className="w-full bg-primary-container text-on-primary border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-secondary-container font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">route</span>
            <span>Hành trình đang đặt</span>
          </div>
          <h1 className="font-display text-lg lg:text-xl font-bold text-on-primary mt-0.5">
            {routeTitle}{" "}
            <span className="text-sm font-normal text-on-primary-container ml-2">
              • {dateLabel}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {STEPS.map((item) => {
            const isActive = item.step === currentStep;
            const isDone = item.step < currentStep;
            return (
              <Link
                key={item.step}
                href={item.href}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-secondary-container text-primary-container shadow-sm"
                    : isDone
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-white/5 text-on-primary-container hover:text-white"
                }`}
              >
                {isDone && (
                  <span className="material-symbols-outlined text-sm">
                    check_circle
                  </span>
                )}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}