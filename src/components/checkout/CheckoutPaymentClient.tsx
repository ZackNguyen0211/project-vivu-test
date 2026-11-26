// src/components/checkout/CheckoutPaymentClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { buildSepayVietQrUrl } from "@/lib/payment/sepay";
import BookingStepHeader from "@/components/layout/BookingStepHeader";

interface CheckoutPaymentClientProps {
  tripId: string;
  seatList: string[];
  pickupStopId: string;
  dropoffStopId: string;
  amount: number;
}

export default function CheckoutPaymentClient({
  tripId,
  seatList,
  pickupStopId,
  dropoffStopId,
  amount,
}: CheckoutPaymentClientProps) {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 phút = 600 giây
  const [bookingCode, setBookingCode] = useState("");
  const [creatingBooking, setCreatingBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [customerName, setCustomerName] = useState("Nguyễn Hà Thành");
  const [customerPhone, setCustomerPhone] = useState("0912345678");
  const [customerEmail, setCustomerEmail] = useState("thanh.nguyen@gmail.com");
  const [paymentMethod, setPaymentMethod] = useState<"SEPAY_VIETQR" | "MOMO">(
    "SEPAY_VIETQR"
  );
  const [simulatingWebhook, setSimulatingWebhook] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  const qrImageUrl = buildSepayVietQrUrl({
    bankName: "MBBank",
    accountNo: "0912345678999",
    amount,
    bookingCode,
  });

  const handleCreatePendingBooking = async () => {
    if (!tripId || seatList.length === 0) {
      setBookingError("Thiếu thông tin chuyến hoặc ghế. Vui lòng chọn lại.");
      return;
    }

    setCreatingBooking(true);
    setBookingError("");
    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId,
          seatCodes: seatList,
          customerName,
          customerPhone,
          customerEmail,
          pickupStopId,
          dropoffStopId,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Không thể giữ ghế.");
      }
      setBookingCode(result.booking_code);
      setSecondsLeft(
        Math.max(
          0,
          Math.floor(
            (new Date(result.expires_at).getTime() - Date.now()) / 1000
          )
        )
      );
    } catch (error) {
      setBookingError(
        error instanceof Error ? error.message : "Không thể giữ ghế."
      );
    } finally {
      setCreatingBooking(false);
    }
  };

  const handleSimulateWebhookSuccess = async () => {
    setSimulatingWebhook(true);
    // PLACEHOLDER: Gọi POST /api/v1/webhooks/sepay hoặc /api/v1/webhooks/momo
    // Cập nhật bookings.status = 'PAID', sinh qr_token và bắn email vé điện tử
    setTimeout(() => {
      setSimulatingWebhook(false);
      router.push(`/bookings/${bookingCode}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-surface pb-16">
      <BookingStepHeader currentStep={3} />

      {/* Thanh cảnh báo đếm ngược khóa ghế 10 phút */}
      <div className="bg-secondary-fixed border-b border-secondary-container/40 py-3 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-on-secondary-fixed">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-lg">
              timer
            </span>
            <span>
              Ghế <strong>{seatList.join(", ")}</strong> đang được khóa tạm thời
              cho riêng bạn (Trạng thái: <code>PENDING</code>)
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-primary-container text-secondary-container font-mono text-sm">
            Thời gian giữ chỗ còn: {minutes}:{seconds}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cột Trái: Thông tin hành khách & Chọn cổng thanh toán */}
        <div className="lg:col-span-7 space-y-6">
          {/* Thông tin nhận vé điện tử */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-on-surface">
                1. Thông tin hành khách & Nhận vé QR
              </h2>
              <span className="px-2.5 py-1 rounded bg-surface-container text-primary-container text-[11px] font-bold">
                Đã đồng bộ từ Google Profile
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Họ và tên hành khách *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface-container-low text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Số điện thoại liên hệ đón xe *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface-container-low text-sm font-semibold"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Địa chỉ Email nhận vé điện tử (QR Code) & Tự động liên kết tài khoản *
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface-container-low text-sm font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Phương thức thanh toán (In-Scope: SePay VietQR & MoMo Sandbox) */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 space-y-4">
            <h2 className="font-display text-lg font-bold text-on-surface">
              2. Phương thức thanh toán trực tuyến
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("SEPAY_VIETQR")}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  paymentMethod === "SEPAY_VIETQR"
                    ? "border-secondary-container bg-secondary-fixed/30"
                    : "border-outline-variant/30 hover:bg-surface-container-low"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-display text-sm font-extrabold text-primary-container">
                    Chuyển khoản VietQR (SePay)
                  </span>
                  <span className="material-symbols-outlined text-secondary">
                    qr_code_scanner
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Quét mã QR động chứa sẵn số tiền & mã đơn. Xác nhận tự động qua SePay Webhook.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("MOMO")}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  paymentMethod === "MOMO"
                    ? "border-secondary-container bg-secondary-fixed/30"
                    : "border-outline-variant/30 hover:bg-surface-container-low"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-display text-sm font-extrabold text-primary-container">
                    Ví điện tử MoMo Sandbox
                  </span>
                  <span className="material-symbols-outlined text-pink-600">
                    account_balance_wallet
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Thanh toán 1 chạm qua cổng MoMo Sandbox, xử lý tự động qua IPN Webhook HMAC_SHA256.
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Cột Phải: Hiển thị Mã QR Động SePay / MoMo & Giả lập Webhook */}
        <div className="lg:col-span-5">
          <div className="bg-primary-container text-on-primary rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-xs text-secondary-container font-bold uppercase">
                  Mã đơn giữ chỗ
                </span>
                <h3 className="font-mono text-xl font-extrabold text-white">
                  {bookingCode}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-on-primary-container block">
                  Tổng thanh toán
                </span>
                <span className="font-display text-2xl font-extrabold text-secondary-container tabular-nums">
                  {new Intl.NumberFormat("vi-VN").format(amount)}₫
                </span>
              </div>
            </div>

            {paymentMethod === "SEPAY_VIETQR" ? (
              <div className="bg-white text-on-surface rounded-xl p-5 text-center space-y-3">
                <span className="text-xs font-bold text-primary-container uppercase block">
                  Quét mã VietQR bằng mọi ứng dụng Ngân hàng
                </span>
                <img
                  src={qrImageUrl}
                  alt="SePay VietQR Dynamic Code"
                  className="w-52 h-52 mx-auto rounded-lg border border-slate-200 object-contain"
                />
                <div className="text-xs space-y-1 bg-surface-container-low p-3 rounded-lg text-left">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Nội dung CK:</span>
                    <strong className="font-mono text-primary-container">
                      {bookingCode}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Số tiền:</span>
                    <strong className="text-secondary">
                      {new Intl.NumberFormat("vi-VN").format(amount)} VND
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 rounded-xl p-6 text-center space-y-3">
                <span className="material-symbols-outlined text-5xl text-secondary-container">
                  qr_code_2
                </span>
                <h4 className="font-display text-base font-bold text-white">
                  Cổng thanh toán MoMo Sandbox
                </h4>
                <p className="text-xs text-on-primary-container">
                  Hệ thống sẽ chuyển hướng sang Payment URL của MoMo kèm chữ ký điện tử HMAC_SHA256.
                </p>
              </div>
            )}

            {bookingError && (
              <div className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-xs font-bold text-error">
                {bookingError}
              </div>
            )}

            {!bookingCode ? (
              <button
                type="button"
                disabled={creatingBooking}
                onClick={handleCreatePendingBooking}
                className="w-full py-4 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-50 text-primary-container font-display text-sm font-extrabold shadow-lg transition-all"
              >
                {creatingBooking ? "ĐANG GIỮ GHẾ..." : "XÁC NHẬN & GIỮ GHẾ 10 PHÚT"}
              </button>
            ) : null}

            <button
              type="button"
              disabled={simulatingWebhook || !bookingCode || secondsLeft === 0}
              onClick={handleSimulateWebhookSuccess}
              className="w-full py-4 rounded-xl bg-secondary-container hover:bg-secondary hover:text-white text-primary-container font-display text-sm font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">
                bolt
              </span>
              <span>
                {simulatingWebhook
                  ? "Đang nhận Webhook & Xuất vé QR..."
                  : "GIẢ LẬP WEBHOOK THANH TOÁN THÀNH CÔNG"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}