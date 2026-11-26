"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TicketLookupClient() {
  const router = useRouter();
  const [bookingCode, setBookingCode] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = bookingCode.trim();
    if (code) {
      router.push(`/bookings/${encodeURIComponent(code)}`);
    }
  };

  return (
    <main className="min-h-[60vh] bg-surface px-6 py-12">
      <section className="mx-auto max-w-xl rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-6 shadow-sm sm:p-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-secondary">
          <span className="material-symbols-outlined text-2xl">
            confirmation_number
          </span>
        </div>
        <h1 className="font-display text-2xl font-extrabold text-on-surface">
          Tra cứu vé điện tử
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
          Nhập mã vé được gửi trong email xác nhận để xem thông tin hành trình.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="booking-code"
              className="mb-1.5 block text-xs font-bold text-on-surface-variant"
            >
              Mã vé
            </label>
            <input
              id="booking-code"
              name="bookingCode"
              type="text"
              value={bookingCode}
              onChange={(event) => setBookingCode(event.target.value)}
              placeholder="Ví dụ: VVC-261126-1234"
              autoComplete="off"
              autoCapitalize="characters"
              maxLength={64}
              required
              className="min-h-12 w-full rounded-xl border border-outline-variant/50 bg-surface px-4 text-sm font-semibold text-on-surface outline-none transition focus:border-secondary-container focus:ring-2 focus:ring-secondary-container/30"
            />
          </div>
          <button
            type="submit"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-container px-5 text-sm font-bold text-on-primary transition-colors hover:bg-primary-container/90"
          >
            <span className="material-symbols-outlined text-lg">search</span>
            Tra cứu vé
          </button>
        </form>

        <p className="mt-5 text-xs text-on-surface-variant">
          Mã vé được bảo vệ theo tài khoản đã dùng để đặt chỗ. Nếu không truy cập
          được, hãy kiểm tra bạn đã đăng nhập đúng tài khoản.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary-container hover:underline"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Về trang chủ
        </Link>
      </section>
    </main>
  );
}
