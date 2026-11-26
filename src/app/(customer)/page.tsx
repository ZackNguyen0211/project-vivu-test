// src/app/(customer)/page.tsx
import React from "react";
import {
  getActiveLocations,
  getCustomerTestimonials,
  getFeaturedOperators,
  getPopularRoutes,
  getPromotionalVouchers,
} from "@/services/home.service";
import HeroSearchSection from "@/components/home/HeroSearchSection";
import VoucherSection from "@/components/home/VoucherSection";
import PopularRoutesSection from "@/components/home/PopularRoutesSection";
import VerifiedOperatorsSection from "@/components/home/VerifiedOperatorsSection";
import ValuePropsSection from "@/components/home/ValuePropsSection";
import TestimonialsAndCta from "@/components/home/TestimonialsAndCta";

export const instant = false;

export default async function HomePage() {
  // Fetch song song toàn bộ dữ liệu động qua các hàm placeholder
  // Khi nối Supabase PostgreSQL, chỉ cần sửa bên trong src/services/home.service.ts
  const [locations, vouchers, popularRoutes, operators, testimonials] =
    await Promise.all([
      getActiveLocations(),
      getPromotionalVouchers(),
      getPopularRoutes(),
      getFeaturedOperators(),
      getCustomerTestimonials(),
    ]);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Banner & Khung tìm kiếm chuyến xe */}
      <HeroSearchSection locations={locations} />

      {/* 2. Danh sách Voucher khuyến mãi */}
      <VoucherSection vouchers={vouchers} />

      {/* 3. Tuyến đường phổ biến (Có lọc theo tỉnh đi) */}
      <PopularRoutesSection initialRoutes={popularRoutes} />

      {/* 4. Đối tác Nhà xe uy tín */}
      <VerifiedOperatorsSection operators={operators} />

      {/* 5. Giá trị cốt lõi & Quy trình đặt vé 4 bước */}
      <ValuePropsSection />

      {/* 6. Đánh giá khách hàng & Banner đăng nhập Google OAuth */}
      <TestimonialsAndCta testimonials={testimonials} />
    </div>
  );
}