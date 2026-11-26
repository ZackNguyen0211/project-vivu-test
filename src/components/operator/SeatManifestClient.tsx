// src/components/operator/SeatManifestClient.tsx
"use client";

import React, { useState } from "react";
import { ManifestPassengerRow } from "@/types/portal";

export default function SeatManifestClient({
  initialPassengers,
}: {
  initialPassengers: ManifestPassengerRow[];
}) {
  const [passengers, setPassengers] = useState(initialPassengers);
  const [qrInput, setQrInput] = useState("VVC-261118-8893");
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const handleQrCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    // PLACEHOLDER: Gọi POST /api/v1/operator/bookings/check-in
    setPassengers((prev) =>
      prev.map((p) =>
        p.booking_code === qrInput.trim()
          ? { ...p, checkin_status: "CHECKED_IN" }
          : p
      )
    );
    setScanMessage(`Đã xác nhận Check-in lên xe cho mã vé ${qrInput}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <span className="text-xs font-bold text-secondary uppercase">
            Phơi xe trực tiếp • Chuyến TRIP-DL-2200 (51B-298.12)
          </span>
          <h1 className="font-display text-xl font-extrabold text-on-surface">
            TP. Hồ Chí Minh ➔ Đà Lạt • Xuất bến 22:00
          </h1>
        </div>

        {/* Form Quét QR Check-in */}
        <form onSubmit={handleQrCheckIn} className="flex items-center gap-2">
          <input
            type="text"
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            placeholder="Quét hoặc nhập mã QR vé..."
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-secondary-container text-primary-container font-display text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">
              qr_code_scanner
            </span>
            <span>Quét QR Check-in</span>
          </button>
        </form>
      </div>

      {scanMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between">
          <span>✓ {scanMessage}</span>
          <button type="button" onClick={() => setScanMessage(null)}>
            Đóng
          </button>
        </div>
      )}

      {/* Danh sách hành khách trên chuyến (Manifest) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-on-surface-variant">
              <th className="py-3.5 px-4">Số ghế</th>
              <th className="py-3.5 px-4">Mã vé (QR)</th>
              <th className="py-3.5 px-4">Hành khách</th>
              <th className="py-3.5 px-4">Điểm đón / Điểm trả</th>
              <th className="py-3.5 px-4">Thanh toán</th>
              <th className="py-3.5 px-4">Trạng thái lên xe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {passengers.map((p) => (
              <tr key={p.booking_id}>
                <td className="py-4 px-4">
                  <span className="px-2.5 py-1 rounded bg-primary-container text-secondary-container font-display font-extrabold">
                    {p.seat_code}
                  </span>
                </td>
                <td className="py-4 px-4 font-mono font-bold">
                  {p.booking_code}
                </td>
                <td className="py-4 px-4">
                  <span className="font-bold block">{p.customer_name}</span>
                  <span className="text-on-surface-variant">
                    {p.customer_phone}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="block">Đón: {p.pickup_point}</span>
                  <span className="text-on-surface-variant">
                    Trả: {p.dropoff_point}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                      p.payment_status === "PAID"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {p.payment_status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                      p.checkin_status === "CHECKED_IN"
                        ? "bg-sky-100 text-sky-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {p.checkin_status === "CHECKED_IN"
                      ? "ĐÃ LÊN XE (CHECKED_IN)"
                      : "CHỜ KHÁCH"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}