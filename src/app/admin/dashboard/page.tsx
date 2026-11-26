// src/app/admin/dashboard/page.tsx
import React from "react";
import Link from "next/link";
import { getAdminPlatformOperators } from "@/services/admin.service";

export const instant = false;

export default async function AdminDashboardPage() {
  const operators = await getAdminPlatformOperators();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-on-surface">
            Tổng quan Sàn & Quản lý Mạng lưới Nhà xe
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Giám sát sản lượng vé toàn hệ thống, duyệt cấp quyền tài khoản Nhà xe (Role: OPERATOR)
          </p>
        </div>
        <Link
          href="/admin/reconciliation"
          className="px-4 py-2.5 rounded-xl bg-primary-container text-white text-xs font-bold"
        >
          Sang trang Đối soát & Hoàn tiền ➔
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Tổng GMV Toàn Sàn (Tháng 11)", val: "26.605.000.000₫" },
          { label: "Tổng Vé Điện Tử Đã Xuất", val: "81.700 vé" },
          { label: "Nhà Xe Đang Hoạt Động", val: "38 Nhà xe" },
          { label: "Tỷ lệ Webhook Thành Công", val: "99.94% (SePay & MoMo)" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-2xl p-5 border border-slate-200"
          >
            <span className="text-xs text-on-surface-variant block">
              {item.label}
            </span>
            <span className="font-display text-xl font-extrabold text-primary-container block mt-1">
              {item.val}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-on-surface-variant">
              <th className="py-3.5 px-4">Mã / Tên Nhà Xe</th>
              <th className="py-3.5 px-4">Tuyến & Đội xe</th>
              <th className="py-3.5 px-4">Sản lượng vé</th>
              <th className="py-3.5 px-4">Doanh thu GMV</th>
              <th className="py-3.5 px-4">Chiết khấu sàn</th>
              <th className="py-3.5 px-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {operators.map((op) => (
              <tr key={op.id}>
                <td className="py-4 px-4">
                  <span className="font-bold text-primary-container block">
                    {op.name}
                  </span>
                  <span className="text-on-surface-variant">
                    {op.code} • Hotline: {op.hotline}
                  </span>
                </td>
                <td className="py-4 px-4">
                  {op.active_routes_count} tuyến • {op.total_coaches} xe
                </td>
                <td className="py-4 px-4 font-bold">
                  {new Intl.NumberFormat("vi-VN").format(op.monthly_tickets)} vé
                </td>
                <td className="py-4 px-4 font-bold tabular-nums">
                  {new Intl.NumberFormat("vi-VN").format(op.gmv_vnd)}₫
                </td>
                <td className="py-4 px-4 font-bold text-secondary">
                  {op.commission_rate}%
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      op.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {op.status}
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