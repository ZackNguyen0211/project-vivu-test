// src/components/layout/PortalShell.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

interface PortalShellProps {
  roleTitle: string;
  roleSubtitle: string;
  navItems: NavItem[];
  children: React.ReactNode;
}

export default function PortalShell({
  roleTitle,
  roleSubtitle,
  navItems,
  children,
}: PortalShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-[#F4F7FB] text-on-surface">
      {/* Sidebar Cố định */}
      <aside className="w-64 bg-primary-container text-on-primary shrink-0 hidden lg:flex flex-col justify-between p-5">
        <div>
          <Link href="/" className="flex items-center gap-2.5 pb-6 border-b border-white/10">
            <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center text-primary-container font-bold">
              <span className="material-symbols-outlined">directions_bus</span>
            </div>
            <div>
              <span className="font-display text-lg font-extrabold text-white block leading-none">
                ViVu<span className="text-secondary-container">Coach</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-container">
                {roleTitle}
              </span>
            </div>
          </Link>

          <div className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? "bg-secondary-container text-primary-container shadow-sm"
                      : "text-on-primary-container hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-lg">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-white/15 text-[10px]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-2">
          <div className="p-3 rounded-xl bg-white/5 text-xs">
            <span className="text-on-primary-container block">Đang đăng nhập:</span>
            <span className="font-bold text-white block mt-0.5">{roleSubtitle}</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-secondary-fixed hover:bg-white/5"
          >
            <span className="material-symbols-outlined text-base">
              open_in_new
            </span>
            <span>Về Trang chủ Đặt vé</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-surface-container text-primary-container text-xs font-bold">
              {roleTitle}
            </span>
            <span className="text-xs text-on-surface-variant hidden sm:inline">
              {roleSubtitle} • Đồng bộ dữ liệu thời gian thực (Supabase Realtime)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/operator/trips"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container"
            >
              Portal Nhà Xe
            </Link>
            <Link
              href="/admin/dashboard"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container"
            >
              Portal Admin
            </Link>
          </div>
        </header>
        <main className="p-6 lg:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}