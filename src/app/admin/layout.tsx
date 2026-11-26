// src/app/admin/layout.tsx
import React from "react";
import PortalShell from "@/components/layout/PortalShell";

const ADMIN_NAV = [
  { label: "Tổng quan Sàn & Nhà xe", href: "/admin/dashboard", icon: "dashboard" },
  { label: "Đối soát & Hoàn tiền (Refund)", href: "/admin/reconciliation", icon: "account_balance" },
];

export const instant = false;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalShell
      roleTitle="SYSTEM ADMIN"
      roleSubtitle="Super Admin Toàn Sàn"
      navItems={ADMIN_NAV}
    >
      {children}
    </PortalShell>
  );
}