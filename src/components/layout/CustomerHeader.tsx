// src/components/layout/CustomerHeader.tsx
"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { label: "Trang chủ", href: "/" },
  { label: "Tìm chuyến & Đặt vé", href: "/search" },
  { label: "Tra cứu vé", href: "/bookings/lookup" },
  { label: "Vé của tôi", href: "/me/bookings" },
  { label: "Ưu đãi & Khuyến mãi", href: "#vouchers" },
  { label: "Đối tác Nhà xe", href: "/partner/register" },
];

function NavLinks({
  isMobile = false,
  onItemClick,
}: {
  isMobile?: boolean;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={`${
              isMobile ? "px-3 py-2.5" : "px-3 py-2 transition-colors"
            } text-[13px] rounded-lg ${
              isActive
                ? "bg-surface-container text-primary-container font-semibold"
                : "text-on-surface-variant hover:text-on-surface font-medium"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

function NavLinksFallback({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${
            isMobile ? "px-3 py-2.5" : "px-3 py-2 transition-colors"
          } text-[13px] rounded-lg text-on-surface-variant hover:text-on-surface font-medium`}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}

export default function CustomerHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setDisplayName("");
        setRole("");
        return;
      }
      const { data: profile } = await supabase
        .from("users")
        .select("full_name, role")
        .eq("id", data.user.id)
        .maybeSingle();
      setDisplayName(profile?.full_name || data.user.email || "Tài khoản");
      setRole(profile?.role || "USER");
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Logo & Desktop Nav */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1.5 group">
            <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-secondary-container text-[22px]">
                directions_bus
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl tracking-tight font-bold text-primary-container leading-none">
                ViVu<span className="text-secondary-container">Coach</span>
              </span>
              <span className="text-[9px] font-bold text-on-surface-variant tracking-wider uppercase mt-1">
                Premium Mobility
              </span>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-0.5">
            <Suspense fallback={<NavLinksFallback />}>
              <NavLinks />
            </Suspense>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-surface-container-low text-[11px] font-semibold text-on-surface">
            <span className="material-symbols-outlined text-on-surface-variant text-base">
              payments
            </span>
            <span>VND (₫)</span>
            <span className="text-outline-variant">|</span>
            <span className="material-symbols-outlined text-on-surface-variant text-base">
              translate
            </span>
            <span>VI</span>
          </div>

          <a
            href="tel:19006868"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-container transition-colors"
          >
            <span className="material-symbols-outlined text-secondary text-[18px]">
              support_agent
            </span>
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-bold uppercase text-secondary leading-none">
                24/7 Hotline
              </span>
              <span className="text-[11px] font-bold leading-tight">1900 6868</span>
            </div>
          </a>

          {displayName ? (
            <div className="hidden sm:flex items-center gap-1.5">
              {role === "ADMIN" ? (
                <Link href="/admin/dashboard" className="min-h-9 px-2.5 rounded-lg bg-surface-container text-[11px] font-bold inline-flex items-center">
                  Admin
                </Link>
              ) : role === "OPERATOR" ? (
                <Link href="/operator/trips" className="min-h-9 px-2.5 rounded-lg bg-surface-container text-[11px] font-bold inline-flex items-center">
                  Nhà xe
                </Link>
              ) : (
                <Link href="/me/bookings" className="min-h-9 px-2.5 rounded-lg bg-surface-container text-[11px] font-bold inline-flex items-center">
                  Vé của tôi
                </Link>
              )}
              <button type="button" onClick={handleLogout} className="min-h-9 px-2.5 rounded-lg text-[11px] font-bold text-error">
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex min-h-10 items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-container text-on-primary hover:bg-[#1e3e62] transition-colors shadow-sm text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-secondary-container text-[18px]">
                stars
              </span>
              <span>ViVuClub / Đăng nhập</span>
            </Link>
          )}

          <button
            type="button"
            aria-label="Mở menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="xl:hidden min-h-10 min-w-10 p-2 rounded-lg hover:bg-surface-container text-on-surface"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-18 bg-surface-container-lowest shadow-xl px-4 py-4 border-t border-outline-variant/30">
          <nav className="flex flex-col gap-1.5">
            <Suspense fallback={<NavLinksFallback isMobile />}>
              <NavLinks
                isMobile
                onItemClick={() => setMobileMenuOpen(false)}
              />
            </Suspense>
            <div className="pt-3 mt-2 border-t border-outline-variant/30 flex flex-col gap-2">
              <a
                href="tel:19006868"
                className="min-h-10 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed text-[13px] font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">
                  support_agent
                </span>
                <span>Hotline nhanh: 1900 6868</span>
              </a>
              {displayName ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="min-h-10 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-primary-container text-on-primary text-[13px] font-semibold"
                >
                  <span className="material-symbols-outlined text-secondary-container text-[18px]">
                    logout
                  </span>
                  <span>Đăng xuất</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-10 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-primary-container text-on-primary text-[13px] font-semibold"
                >
                  <span className="material-symbols-outlined text-secondary-container text-[18px]">
                    stars
                  </span>
                  <span>Đăng nhập Google / ViVuClub</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}