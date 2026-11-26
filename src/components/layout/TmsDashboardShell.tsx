// src/components/layout/TmsDashboardShell.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_NAV = [
  { label: "Tổng quan sàn", href: "/admin/dashboard", icon: "monitoring" },
  { label: "Báo cáo & Đối soát", href: "/admin/reconciliation", icon: "account_balance_wallet" },
];

const OPERATOR_NAV = [
  { label: "Lịch trình chuyến", href: "/operator/trips", icon: "calendar_month" },
  { label: "Sơ đồ ghế & Check-in QR", href: "/operator/check-in", icon: "airline_seat_recline_extra" },
];

export default function TmsDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Fixed Left Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 hidden lg:flex flex-col shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-outline-variant/20">
        <Link
          href="/"
          className="h-16 flex items-center px-6 gap-3 bg-surface-container-low"
        >
          <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary-container text-[22px]">
              directions_bus
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold text-on-surface leading-none">
              ViVuCoach
            </span>
            <span className="text-[11px] font-bold text-secondary tracking-widest uppercase mt-1">
              Việt Nam TMS
            </span>
          </div>
        </Link>

        <div className="p-4">
          <div className="bg-surface-container-low rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
              <span className="text-[11px] font-bold text-on-surface-variant uppercase">
                Hệ Thống
              </span>
            </div>
            <span className="text-[11px] font-bold bg-surface-container-high px-2 py-0.5 rounded text-on-surface">
              v2.4 Live
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="px-2 pt-2 pb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
              Super Admin Portal
            </span>
          </div>
          {ADMIN_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-surface-container text-on-surface font-bold"
                    : "text-on-surface-variant hover:bg-surface-container/60 hover:text-on-surface font-medium"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="px-2 pt-5 pb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
              Coach Operator Portal
            </span>
          </div>
          {OPERATOR_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-surface-container text-on-surface font-bold"
                    : "text-on-surface-variant hover:bg-surface-container/60 hover:text-on-surface font-medium"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="px-2 pt-5 pb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
              Phân hệ Khách hàng
            </span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container/60 hover:text-on-surface font-medium"
          >
            <span className="material-symbols-outlined text-[20px]">
              storefront
            </span>
            <span>Quay lại Trang Đặt Vé</span>
          </Link>
        </nav>

        <div className="p-4 bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary-container text-[18px]">
                verified_user
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-on-surface truncate">
                Trung tâm Điều hành
              </span>
              <span className="text-[11px] text-on-surface-variant truncate">
                RBAC Middleware Active
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-72">
        <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl z-40 shadow-[0_1px_8px_rgba(0,0,0,0.04)] px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-surface-container-low px-3.5 py-1.5 rounded-lg">
              <span className="material-symbols-outlined text-[18px] text-secondary">
                swap_horiz
              </span>
              <select className="bg-transparent text-xs font-semibold text-on-surface outline-none cursor-pointer">
                <option value="all">Tất cả Đơn vị / Toàn sàn</option>
                <option value="futa">Nhà xe Phương Trang (FUTA)</option>
                <option value="hm">Hoa Mai Limousine VIP</option>
                <option value="tb">Nhà xe Thành Bưởi</option>
              </select>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-on-surface-variant text-xs">
              <span className="material-symbols-outlined text-[16px]">
                corporate_fare
              </span>
              <span>Điều hành Liên tỉnh</span>
              <span className="text-outline-variant">/</span>
              <span className="text-on-surface font-semibold">Việt Nam</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pl-2">
              <div className="flex flex-col text-right hidden sm:block">
                <span className="text-xs font-bold text-on-surface leading-tight">
                  Nguyễn Hà Thành
                </span>
                <span className="text-[11px] text-secondary font-semibold leading-tight">
                  {pathname.startsWith("/admin") ? "System Admin" : "Operator Manager"}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">
                  person
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="w-full pt-16 min-h-screen">{children}</main>
      </div>
    </div>
  );
}