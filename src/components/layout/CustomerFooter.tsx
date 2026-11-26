// src/components/layout/CustomerFooter.tsx
import React from "react";
import Link from "next/link";

export default function CustomerFooter() {
  return (
    <footer className="w-full bg-primary-container text-on-primary-container pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-secondary-container text-2xl">
                  directions_bus
                </span>
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-on-primary leading-none">
                ViVu<span className="text-secondary-container">Coach</span>
              </span>
            </div>
            <p className="text-sm text-on-primary-container leading-relaxed">
              Nền tảng công nghệ đặt vé xe khách liên tỉnh đa nhà xe. Kết nối các
              nhà xe chất lượng cao với cơ chế khóa ghế thời gian thực 10 phút và
              hệ thống vé điện tử QR tự động qua Email.
            </p>
            <div className="flex items-center gap-2 text-secondary-container">
              <span className="material-symbols-outlined text-[20px]">eco</span>
              <span className="text-xs font-semibold">
                Hành trình xanh & An toàn tuyệt đối
              </span>
            </div>
          </div>

          {/* Popular Routes */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <span className="font-display text-base text-on-primary font-bold">
              Tuyến xe phổ biến
            </span>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link
                  href="/search?from=TP.+Hồ+Chí+Minh&to=Đà+Lạt+(Lâm+Đồng)"
                  className="hover:text-on-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary-container">
                    arrow_right_alt
                  </span>
                  Sài Gòn ⇄ Đà Lạt Limousine
                </Link>
              </li>
              <li>
                <Link
                  href="/search?from=TP.+Hồ+Chí+Minh&to=Phan+Thiết+(Bình+Thuận)"
                  className="hover:text-on-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary-container">
                    arrow_right_alt
                  </span>
                  Sài Gòn ⇄ Phan Thiết / Mũi Né
                </Link>
              </li>
              <li>
                <Link
                  href="/search?from=TP.+Hồ+Chí+Minh&to=Nha+Trang+(Khánh+Hòa)"
                  className="hover:text-on-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary-container">
                    arrow_right_alt
                  </span>
                  Sài Gòn ⇄ Nha Trang Giường Nằm
                </Link>
              </li>
              <li>
                <Link
                  href="/search?from=Hà+Nội&to=Sa+Pa+(Lào+Cai)"
                  className="hover:text-on-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary-container">
                    arrow_right_alt
                  </span>
                  Hà Nội ⇄ Sa Pa Cabin VIP
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <span className="font-display text-base text-on-primary font-bold">
              Chăm sóc khách hàng
            </span>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary-container">
                  call
                </span>
                <div>
                  <span className="text-xs block">Hotline 24/7:</span>
                  <a
                    href="tel:19006868"
                    className="text-sm font-bold text-on-primary hover:text-secondary-container transition-colors"
                  >
                    1900 6868
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary-container">
                  mail
                </span>
                <a
                  href="mailto:cskh@vivucoach.vn"
                  className="hover:text-on-primary transition-colors"
                >
                  cskh@vivucoach.vn
                </a>
              </li>
              <li>
                <Link
                  href="/bookings/lookup"
                  className="hover:text-on-primary transition-colors"
                >
                  Tra cứu vé điện tử bằng Mã đơn
                </Link>
              </li>
              <li>
                <Link
                  href="/me/bookings"
                  className="hover:text-on-primary transition-colors"
                >
                  Chính sách hủy vé trước 24h & Hoàn tiền
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Gateways (In-Scope: VietQR SePay & MoMo) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <span className="font-display text-base text-on-primary font-bold">
              Cổng thanh toán
            </span>
            <p className="text-xs text-on-primary-container">
              Xác nhận tự động tức thì qua Webhook 24/7
            </p>
            <div className="flex flex-col gap-2.5 text-xs text-on-primary">
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-white/5">
                <span className="material-symbols-outlined text-secondary-container text-[20px]">
                  qr_code_scanner
                </span>
                <span>VietQR (SePay 24/7)</span>
              </div>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-white/5">
                <span className="material-symbols-outlined text-secondary-container text-[20px]">
                  account_balance_wallet
                </span>
                <span>Ví điện tử MoMo</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Nền tảng đặt vé xe khách trực tuyến ViVuCoach. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/partner/register" className="hover:text-on-primary transition-colors">
              Kênh Nhà Xe (Operator)
            </Link>
            <Link href="/admin/dashboard" className="hover:text-on-primary transition-colors">
              Quản trị Hệ thống (Admin)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}