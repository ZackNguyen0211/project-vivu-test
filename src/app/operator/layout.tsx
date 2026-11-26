// src/app/operator/layout.tsx
import React from "react";
import PortalShell from "@/components/layout/PortalShell";

const OPERATOR_NAV = [
  { label: "Quản lý Lịch chạy (Trips)", href: "/operator/trips", icon: "calendar_month", badge: "Live" },
  { label: "Phơi xe & Quét QR Check-in", href: "/operator/seat-manifest", icon: "qr_code_scanner" },
];

export const instant = false;

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalShell
      roleTitle="OPERATOR PORTAL"
      roleSubtitle="Nhà xe Phương Trang (FUTA)"
      navItems={OPERATOR_NAV}
    >
      {children}
    </PortalShell>
  );
}