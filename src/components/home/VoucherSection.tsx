// src/components/home/VoucherSection.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VoucherItem } from "@/types/home";

interface VoucherSectionProps {
  vouchers: VoucherItem[];
}

export default function VoucherSection({ vouchers }: VoucherSectionProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // Fallback nếu trình duyệt chặn clipboard
    }
  };

  return (
    <section
      id="vouchers"
      className="max-w-7xl mx-auto px-6 lg:px-12 py-14 w-full"
    >
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-3 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-base">
              local_fire_department
            </span>
            <span>Hot hôm nay</span>
          </div>
          <h2 className="font-display text-3xl lg:text-[2.25rem] font-bold text-on-surface leading-tight">
            Ưu đãi dành riêng cho bạn
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Áp dụng ngay khi thanh toán qua cổng điện tử VietQR (SePay) và Ví MoMo
          </p>
        </div>
        <Link
          href="/search"
          className="inline-flex items-center gap-1 text-sm font-bold text-secondary hover:text-secondary-container transition-colors"
        >
          <span>Khám phá chuyến xe ưu đãi</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vouchers.map((voucher) => {
          const isCopied = copiedCode === voucher.code;

          if (voucher.is_vip_club) {
            return (
              <div
                key={voucher.id}
                className="bg-primary-container text-on-primary rounded-xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-secondary-container/20 pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded bg-secondary-container text-primary-container text-[11px] font-extrabold uppercase">
                      {voucher.badge}
                    </span>
                    <span className="material-symbols-outlined text-secondary-container">
                      {voucher.icon}
                    </span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-on-primary">
                    {voucher.title}
                  </h3>
                  <p className="text-xs text-on-primary-container mt-1.5 leading-relaxed">
                    {voucher.description}
                  </p>
                </div>

                <div className="mt-6 pt-2 flex items-center justify-between bg-white/10 rounded-lg p-2.5">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-on-primary-container">
                      Chương trình
                    </span>
                    <span className="font-mono text-base font-bold tracking-widest text-secondary-container">
                      {voucher.code}
                    </span>
                  </div>
                  <Link
                    href="/login"
                    className="min-h-[40px] px-3.5 py-2 rounded bg-secondary-container hover:bg-secondary hover:text-white text-primary-container text-xs sm:text-[13px] font-bold transition-colors"
                  >
                    Kích hoạt
                  </Link>
                </div>
              </div>
            );
          }

          return (
            <div
              key={voucher.id}
              className="bg-surface-container-lowest rounded-xl p-6 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between border border-outline-variant/25"
            >
              <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-secondary-container/10 pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
                    {voucher.badge}
                  </span>
                  <span className="material-symbols-outlined text-secondary-container">
                    {voucher.icon}
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-on-surface">
                  {voucher.title}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  {voucher.description}
                </p>
              </div>

              <div className="mt-6 pt-2 flex items-center justify-between bg-surface-container-low rounded-lg p-2.5">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-on-surface-variant">
                    Mã giảm giá
                  </span>
                  <span className="font-mono text-base font-bold tracking-widest text-primary-container">
                    {voucher.code}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(voucher.code)}
                  className={`min-h-[40px] px-3.5 py-2 rounded text-xs sm:text-[13px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                    isCopied
                      ? "bg-secondary text-white"
                      : "bg-primary-container hover:bg-secondary text-on-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {isCopied ? "check" : "content_copy"}
                  </span>
                  <span>{isCopied ? "Đã chép!" : "Sao chép"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}