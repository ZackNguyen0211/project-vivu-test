// src/components/ticket/ElectronicTicketClient.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ElectronicTicketData } from "@/types/booking";
import BookingStepHeader from "@/components/layout/BookingStepHeader";

interface ElectronicTicketClientProps {
  ticket: ElectronicTicketData;
}

export default function ElectronicTicketClient({
  ticket,
}: ElectronicTicketClientProps) {
  return (
    <div className="min-h-screen bg-surface pb-16">
      <BookingStepHeader currentStep={4} />

      <div className="max-w-4xl mx-auto px-6 pt-10 space-y-6">
        {/* Banner thông báo thành công */}
        <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <span className="material-symbols-outlined text-3xl">
                verified
              </span>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Thanh toán thành công • Đã gửi Email vé điện tử
              </span>
              <h2 className="font-display text-xl font-extrabold">
                Mã đơn vé: {ticket.booking_code}
              </h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                Bản sao vé điện tử kèm mã QR đã được gửi tới{" "}
                <strong>{ticket.customer_email}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">print</span>
            <span>Tải PDF / In vé</span>
          </button>
        </div>

        {/* Digital Boarding Pass 2 Tầng */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden">
          {/* Tầng Trên: Thông tin Chuyến & Ghế */}
          <div className="bg-primary-container text-on-primary p-6 lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container">
                  directions_bus
                </span>
                <span className="font-display text-base font-bold">
                  {ticket.operator_name}
                </span>
                <span className="text-xs text-on-primary-container">
                  • {ticket.coach_type_label}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold">
                ĐÃ THANH TOÁN (PAID)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 items-center">
              <div>
                <span className="text-xs text-on-primary-container block">
                  Khởi hành ({ticket.departure_date})
                </span>
                <span className="font-display text-3xl font-extrabold text-secondary-container tabular-nums">
                  {ticket.departure_time}
                </span>
                <span className="block font-display text-sm font-bold text-white mt-1">
                  {ticket.departure_province}
                </span>
                <span className="block text-xs text-on-primary-container mt-0.5">
                  {ticket.pickup_station}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center">
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-secondary-fixed">
                  Biển số: {ticket.license_plate}
                </span>
                <div className="w-full border-t border-dashed border-white/30 my-3" />
                <span className="text-xs text-on-primary-container">
                  Đúng số giường đã chọn
                </span>
              </div>

              <div className="md:text-right">
                <span className="text-xs text-on-primary-container block">
                  Dự kiến đến nơi
                </span>
                <span className="font-display text-3xl font-extrabold text-white tabular-nums">
                  {ticket.arrival_time}
                </span>
                <span className="block font-display text-sm font-bold text-white mt-1">
                  {ticket.destination_province}
                </span>
                <span className="block text-xs text-on-primary-container mt-0.5">
                  {ticket.dropoff_station}
                </span>
              </div>
            </div>
          </div>

          {/* Đường cắt vé (Perforated Divider) */}
          <div className="border-t-2 border-dashed border-slate-300 relative" />

          {/* Tầng Dưới: Hành khách & Mã QR Check-in */}
          <div className="p-6 lg:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-on-surface-variant block">
                    Hành khách
                  </span>
                  <span className="font-display text-sm font-extrabold text-on-surface">
                    {ticket.customer_name}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block">
                    Số điện thoại
                  </span>
                  <span className="font-display text-sm font-extrabold text-on-surface">
                    {ticket.customer_phone}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block">
                    Số ghế / Giường
                  </span>
                  <span className="font-display text-base font-extrabold text-secondary">
                    {ticket.seat_codes.join(", ")}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low text-xs space-y-1.5">
                <div>
                  <strong>Điểm đón:</strong> {ticket.pickup_station} (
                  {ticket.pickup_address})
                </div>
                <div>
                  <strong>Điểm trả:</strong> {ticket.dropoff_station} (
                  {ticket.dropoff_address})
                </div>
                <div>
                  <strong>Giao dịch:</strong>{" "}
                  {new Intl.NumberFormat("vi-VN").format(ticket.total_amount)}₫
                  qua {ticket.payment_provider} (Mã GD: {ticket.transaction_id})
                </div>
              </div>
            </div>

            {/* Khối QR Check-in */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 text-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                  `${ticket.booking_code}|${ticket.qr_token}`
                )}`}
                alt="Ticket QR Check-in"
                className="w-36 h-36 rounded-lg bg-white p-2 shadow-xs"
              />
              <span className="font-mono text-xs font-bold text-primary-container mt-2">
                {ticket.booking_code}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">
                Đưa mã QR này cho nhà xe quét khi lên xe
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <Link
            href="/"
            className="text-sm font-bold text-primary-container hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            Về trang chủ
          </Link>
          <Link
            href="/operator/seat-manifest"
            className="px-5 py-2.5 rounded-xl bg-primary-container text-on-primary text-xs font-bold"
          >
            Mở màn hình Nhà xe quét QR Check-in ➔
          </Link>
        </div>
      </div>
    </div>
  );
}