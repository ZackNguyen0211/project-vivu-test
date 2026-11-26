// src/components/operator/OperatorTripsClient.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OperatorTripRow } from "@/types/portal";

export default function OperatorTripsClient({
  initialTrips,
}: {
  initialTrips: OperatorTripRow[];
}) {
  const [trips, setTrips] = useState(initialTrips);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleQuickCreateTrip = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTrip: OperatorTripRow = {
      id: `trip-op-${Date.now()}`,
      trip_code: `TRIP-DL-${formData.get("time")}`,
      route_name: String(formData.get("route") || "TP.HCM ➔ Đà Lạt"),
      departure_station: "BX Miền Đông Mới",
      destination_station: "BX Liên Tỉnh Đà Lạt",
      departure_time: String(formData.get("time") || "23:15"),
      arrival_time: "05:45 (+1)",
      license_plate: String(formData.get("plate") || "51B-999.88"),
      coach_type_label: String(formData.get("coachType") || "Limousine 22 Phòng"),
      driver_name: "Tài xế ca đêm",
      booked_seats: 0,
      total_seats: 22,
      ticket_price: Number(formData.get("price") || 450000),
      status: "SCHEDULED",
    };
    setTrips((prev) => [newTrip, ...prev]);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-on-surface">
            Điều phối Lịch trình & Mở bán Chuyến xe
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Dữ liệu cách ly theo <code>operator_id</code> của Nhà xe Phương Trang
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-secondary-container hover:bg-secondary hover:text-white text-primary-container font-display text-xs font-extrabold shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          <span>Lên lịch chuyến mới</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Chuyến xuất bến hôm nay", val: "28 chuyến", sub: "4 chuyến đang đón khách" },
          { label: "Tỷ lệ lấp đầy ghế", val: "89.4%", sub: "542 / 606 ghế đã bán" },
          { label: "Khách đã Check-in QR", val: "312 khách", sub: "100% vé hợp lệ" },
          { label: "Doanh thu tạm tính", val: "198.400.000₫", sub: "VietQR SePay & MoMo" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs"
          >
            <span className="text-xs text-on-surface-variant block">
              {kpi.label}
            </span>
            <span className="font-display text-2xl font-extrabold text-primary-container block mt-1">
              {kpi.val}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
              {kpi.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Bảng danh sách Chuyến xe */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-on-surface-variant">
              <th className="py-3.5 px-4">Mã chuyến / Tuyến</th>
              <th className="py-3.5 px-4">Giờ xuất bến</th>
              <th className="py-3.5 px-4">Đội xe & Layout</th>
              <th className="py-3.5 px-4">Tỷ lệ lấp đầy</th>
              <th className="py-3.5 px-4">Giá vé</th>
              <th className="py-3.5 px-4">Trạng thái</th>
              <th className="py-3.5 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {trips.map((t) => {
              const ratio = Math.round((t.booked_seats / t.total_seats) * 100);
              return (
                <tr key={t.id} className="hover:bg-slate-50/80">
                  <td className="py-4 px-4">
                    <span className="font-mono font-bold text-primary-container block">
                      {t.trip_code}
                    </span>
                    <span className="font-semibold text-on-surface">
                      {t.route_name}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-display font-bold tabular-nums">
                    {t.departure_time} ➔ {t.arrival_time}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-on-surface block">
                      {t.license_plate}
                    </span>
                    <span className="text-on-surface-variant">
                      {t.coach_type_label}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-secondary-container"
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                      <span className="font-bold">
                        {t.booked_seats}/{t.total_seats}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold tabular-nums">
                    {new Intl.NumberFormat("vi-VN").format(t.ticket_price)}₫
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        t.status === "BOARDING"
                          ? "bg-amber-100 text-amber-800"
                          : t.status === "ON_ROUTE"
                          ? "bg-sky-100 text-sky-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link
                      href="/operator/seat-manifest"
                      className="px-3 py-1.5 rounded-lg bg-primary-container text-white font-semibold hover:bg-[#1e3e62]"
                    >
                      Xem phơi xe & Check-in
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Tạo Chuyến */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleQuickCreateTrip}
            className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl"
          >
            <h3 className="font-display text-lg font-bold text-on-surface">
              Mở bán chuyến xe mới
            </h3>
            <div>
              <label className="text-xs font-bold block mb-1">Tuyến đường</label>
              <input
                name="route"
                defaultValue="TP.HCM ➔ Đà Lạt"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold block mb-1">Giờ chạy</label>
                <input
                  name="time"
                  defaultValue="23:15"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Giá vé (VND)</label>
                <input
                  name="price"
                  type="number"
                  defaultValue={450000}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold block mb-1">Biển số xe</label>
                <input
                  name="plate"
                  defaultValue="51B-999.88"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Mẫu sơ đồ ghế</label>
                <select
                  name="coachType"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                >
                  <option value="Limousine 22 Phòng">LIMOUSINE_22</option>
                  <option value="Giường Nằm 36 Chỗ">SLEEPER_36</option>
                  <option value="Ghế Ngồi 45 Chỗ">SEATER_45</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-secondary-container text-primary-container text-xs font-extrabold"
              >
                Lưu & Mở bán
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}