// src/components/home/TestimonialsAndCta.tsx
import React from "react";
import Link from "next/link";
import { TestimonialItem } from "@/types/home";

interface TestimonialsAndCtaProps {
  testimonials: TestimonialItem[];
}

export default function TestimonialsAndCta({
  testimonials,
}: TestimonialsAndCtaProps) {
  return (
    <>
      {/* CUSTOMER TESTIMONIALS */}
      <section className="w-full bg-surface-container-low py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs text-secondary uppercase font-bold tracking-wider">
                Trải nghiệm thực tế
              </span>
              <h2 className="font-display text-3xl lg:text-[2.25rem] font-bold text-on-surface mt-1 leading-tight">
                Đánh giá từ hành khách trên mọi cung đường
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Hơn 450.000+ chuyến đi hoàn thành êm ái mỗi năm
              </p>
            </div>

            <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 rounded-xl shadow-xs border border-outline-variant/20">
              <div className="flex text-secondary-container">
                {[...Array(5)].map((_, idx) => (
                  <span
                    key={idx}
                    className="material-symbols-outlined material-symbols-filled text-lg"
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="font-display text-base font-bold text-primary-container">
                4.9 / 5.0
              </span>
              <span className="text-xs text-on-surface-variant">
                (18.400 lượt đánh giá)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, idx) => (
              <div
                key={item.id}
                className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs flex flex-col justify-between border border-outline-variant/20"
              >
                <div>
                  <div className="flex text-secondary-container mb-3">
                    {[...Array(item.rating)].map((_, starIdx) => (
                      <span
                        key={starIdx}
                        className="material-symbols-outlined material-symbols-filled text-base"
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-[13px] sm:text-sm text-on-surface italic leading-relaxed">
                    &ldquo;{item.comment}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-surface-container flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      idx === 1
                        ? "bg-secondary-fixed text-secondary"
                        : "bg-surface-container text-primary-container"
                    }`}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <span className="block font-display text-sm font-bold text-on-surface">
                      {item.customer_name}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {item.route_info}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM GOOGLE OAUTH CONVERSION BANNER */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-14 w-full">
        <div className="relative rounded-2xl bg-primary-container text-on-primary p-8 lg:p-14 overflow-hidden shadow-xl">
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-tertiary-fixed-dim/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-secondary-container/20 text-secondary-container text-xs font-bold uppercase tracking-wider mb-3">
                <span className="material-symbols-outlined text-base">
                  stars
                </span>
                <span>Đồng bộ vé thông minh qua Gmail</span>
              </div>
              <h2 className="font-display text-2xl lg:text-4xl font-bold text-on-primary tracking-tight leading-tight">
                Sẵn sàng cho chuyến đi kế tiếp của bạn?
              </h2>
              <p className="text-sm lg:text-base text-on-primary-container mt-3 leading-relaxed">
                Đăng nhập nhanh bằng{" "}
                <strong className="text-secondary-container">
                  Google OAuth
                </strong>{" "}
                để tự động điền thông tin khi đặt vé, đồng bộ toàn bộ lịch sử vé
                đã đặt bằng Email và chủ động quản lý/hủy vé trực tuyến 24/7.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
              <Link
                href="/login"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-surface-container-lowest text-primary-container hover:bg-surface-bright transition-colors font-display text-sm font-bold shadow-md flex items-center justify-center gap-2.5"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Đăng nhập với Google</span>
              </Link>

              <Link
                href="/search"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-secondary-container hover:bg-secondary hover:text-white text-primary-container transition-colors font-display text-sm font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>Tìm chuyến ngay</span>
                <span className="material-symbols-outlined text-xl">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}