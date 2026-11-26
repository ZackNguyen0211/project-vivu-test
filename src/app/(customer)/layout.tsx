// src/app/(customer)/layout.tsx
import React from "react";
import CustomerHeader from "@/components/layout/CustomerHeader";
import CustomerFooter from "@/components/layout/CustomerFooter";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <CustomerHeader />
      <main className="flex-1 w-full pt-20">{children}</main>
      <CustomerFooter />
    </div>
  );
}