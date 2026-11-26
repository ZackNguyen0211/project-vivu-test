// src/app/admin/reconciliation/page.tsx
import React from "react";
import { getAdminReconciliationPayouts } from "@/services/admin.service";

export const instant = false;

export default async function AdminReconciliationPage() {
  const payouts = await getAdminReconciliationPayouts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-on-surface">
          Đối soát Giao dịch (SePay VietQR & MoMo) & Duyệt Hoàn Tiền
        </h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Xác nhận hoàn tiền các đơn <code>CANCELLED_PENDING_REFUND</code> sang{" "}
          <code>REFUNDED</code> và quyết toán định kỳ cho Nhà xe
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-on-surface-variant">
              <th className="py-3.5 px-4">Mã kỳ đối soát / Nhà xe</th>
              <th className="py-3.5 px-4">Tổng thu (Gross)</th>
              <th className="py-3.5 px-4">Phí nền tảng</th>
              <th className="py-3.5 px-4">Khấu trừ Hoàn vé</th>
              <th className="py-3.5 px-4">Thực nhận (Net Payout)</th>
              <th className="py-3.5 px-4">Khớp Webhook</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {payouts.map((p) => (
              <tr key={p.id}>
                <td className="py-4 px-4">
                  <span className="font-mono font-bold text-primary-container block">
                    {p.settlement_code}
                  </span>
                  <span className="font-semibold">{p.operator_name}</span>
                  <span className="block text-on-surface-variant text-[11px]">
                    {p.bank_info}
                  </span>
                </td>
                <td className="py-4 px-4 font-bold tabular-nums">
                  {new Intl.NumberFormat("vi-VN").format(p.gross_amount)}₫
                </td>
                <td className="py-4 px-4 text-on-surface-variant tabular-nums">
                  -{new Intl.NumberFormat("vi-VN").format(p.platform_fee)}₫
                </td>
                <td className="py-4 px-4 text-error tabular-nums">
                  -{new Intl.NumberFormat("vi-VN").format(p.refund_deduction)}₫
                </td>
                <td className="py-4 px-4 font-display text-sm font-extrabold text-emerald-700 tabular-nums">
                  {new Intl.NumberFormat("vi-VN").format(p.net_payout)}₫
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      p.payment_gateway_match === "MATCHED_100"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {p.payment_gateway_match}
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