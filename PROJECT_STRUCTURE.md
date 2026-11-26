# ViVuCoach - Project Map

Tài liệu định hướng nhanh cho agent/dev. Dùng để tìm đúng entrypoint trước khi đọc code; đây không phải tài liệu thay thế implementation. Khi cần sửa, chỉ đọc các file liên quan trực tiếp.

## Stack và cách chạy

- Next.js App Router 16, React 19, TypeScript strict, Tailwind CSS 4.
- Supabase Auth/Postgres qua `@supabase/ssr` và `@supabase/supabase-js`.
- Package manager: pnpm (`packageManager` trong `package.json`).
- Alias `@/*` trỏ tới `src/*` (`tsconfig.json`).
- Lệnh: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm start`.

## Bản đồ thư mục

```text
src/
  app/                 App Router: route pages, layouts, API handlers, global styles
    (customer)/        Trang công khai/khách hàng, booking và partner registration
    admin/             Dashboard và đối soát quản trị
    operator/          Lịch chuyến và seat manifest nhà xe
    api/               Auth callback, booking API
  components/
    layout/            Header/footer khách hàng, booking progress, dashboard shells
    home/              Các section trang chủ
    search/ seats/     UI chọn chuyến và ghế
    checkout/ ticket/  Thanh toán và vé điện tử
    partner/ operator/ Đăng ký đối tác và UI nhà xe
  services/            Server-side data access và mapping dữ liệu UI
  lib/                 Supabase clients/config và payment helpers
  types/               Kiểu dữ liệu dùng chung theo domain
  proxy.ts             Refresh/kiểm tra session và bảo vệ route
supabase/
  migrations/          SQL migrations có thứ tự theo timestamp
  seed.sql             Dữ liệu demo
.github/instructions/  Hướng dẫn theo phạm vi file; xem new-page.instructions.md
```

## Routes và entrypoints

| Route | File | Nguồn dữ liệu / UI chính |
|---|---|---|
| `/` | `src/app/(customer)/page.tsx` | `home.service.ts`; các component `home/` |
| `/search` | `src/app/(customer)/search/page.tsx` | `searchAvailableTrips`; `SearchScheduleClient` |
| `/trips/[tripId]/seats` | `src/app/(customer)/trips/[tripId]/seats/page.tsx` | `getTripSeatMap`; `SeatSelectionClient` |
| `/checkout` | `src/app/(customer)/checkout/page.tsx` | Checkout client component |
| `/bookings/lookup` | `src/app/(customer)/bookings/lookup/page.tsx` | `TicketLookupClient`; requires sign-in |
| `/bookings/[code]` | `src/app/(customer)/bookings/[code]/page.tsx` | `getElectronicTicketByCode`; `ElectronicTicketClient` |
| `/me/bookings`, `/login` | `src/app/(customer)/me/`, `login/page.tsx` | Khu vực tài khoản |
| `/partner/register` | `src/app/(customer)/partner/register/page.tsx` | `PartnerRegistrationClient` |
| `/admin/dashboard` | `src/app/admin/dashboard/page.tsx` | `getAdminPlatformOperators` |
| `/admin/reconciliation` | `src/app/admin/reconciliation/page.tsx` | `getAdminReconciliationPayouts` |
| `/operator/trips` | `src/app/operator/trips/page.tsx` | `getOperatorScheduleTrips` |
| `/operator/seat-manifest` | `src/app/operator/seat-manifest/page.tsx` | `getTripManifestPassengers` |
| `/api/auth/callback` | `src/app/api/auth/callback/route.ts` | Supabase OAuth/email callback |
| `/api/bookings/create` | `src/app/api/bookings/create/route.ts` | RPC `create_pending_booking` |
| `/403` | `src/app/403/page.tsx` | Trang từ chối truy cập |

`src/app/layout.tsx` là root layout; `(customer)`, `admin`, `operator` có layout riêng. Route group `(customer)` không xuất hiện trong URL.

## Tìm theo loại công việc

| Công việc | Bắt đầu từ |
|---|---|
| Tạo/sửa trang hoặc chọn layout, component dùng chung | `.github/instructions/new-page.instructions.md`, route `page.tsx`, layout tương ứng |
| Trang chủ / dữ liệu locations, routes, vouchers | `src/app/(customer)/page.tsx`, `src/services/home.service.ts`, `src/types/home.ts` |
| Search, seat selection, booking | `src/services/booking.service.ts`, `src/types/booking.ts`, `src/app/api/bookings/create/route.ts` |
| Payment/VietQR | `src/components/checkout/CheckoutPaymentClient.tsx`, `src/lib/payment/sepay.ts`; webhook chưa có API route trong cây hiện tại |
| Ticket lookup/QR | `src/app/(customer)/bookings/lookup/page.tsx`, `src/app/(customer)/bookings/[code]/page.tsx`, `src/components/ticket/` |
| Operator portal | `src/services/operator.service.ts`, `src/types/portal.ts`, `src/types/tms.ts`, `src/components/operator/` |
| Admin dashboard/reconciliation | `src/services/admin.service.ts`, `src/types/portal.ts`, `src/components/layout/PortalShell.tsx` |
| Auth/role guard | `src/proxy.ts`, `src/app/api/auth/callback/route.ts`, `src/lib/supabase/` |
| Schema, RLS, seed, DB RPC | `supabase/migrations/` theo thứ tự timestamp; seed ở `supabase/seed.sql` |
| Màu/font/icon | `src/app/globals.css`, root `src/app/layout.tsx` |

## Ranh giới kiến trúc

- `app/**/page.tsx` là Server Component để đọc params và gọi service. Tương tác trình duyệt đặt trong `*Client.tsx` dưới `src/components/<feature>/`.
- Services gom truy vấn Supabase và chuyển dữ liệu thành types phù hợp UI. Tránh viết lại truy vấn giống nhau trong page/client.
- `src/lib/supabase/client.ts`: browser client; `server.ts`: public server-side client; `admin.ts`: service-role client nếu cấu hình server-side. Không import admin client vào client component và không đưa service-role key ra trình duyệt.
- `src/proxy.ts` kiểm tra session/role cho route bảo vệ; giữ policy nhất quán khi thêm route admin/operator/private.
- Dùng `@/` imports; types domain nằm trong `src/types/`.
- UI tokens Tailwind định nghĩa tại `src/app/globals.css`: fonts `Plus Jakarta Sans` / `Inter`, icon Google Material Symbols. Ưu tiên token thay vì màu/font hard-code.

## Supabase migrations

Migrations cục bộ hiện có:

1. `202611200001_create_vivu_schema.sql` — core tables, RLS, seat occupancy helpers.
2. `202611200002_fix_booking_rls.sql` — chỉnh policy đọc booking.
3. `202611200003_seed_demo_accounts.sql` — tài khoản demo.
4. `202611200004_add_user_signup_trigger.sql` — tạo profile USER khi signup.
5. `202611200005_assign_manual_demo_roles.sql` — gán role cho tài khoản tạo thủ công.
6. `202611200006_create_partner_applications.sql` — partner applications và RPC submit.
7. `202611200007_complete_booking_seat_locking.sql` — unique trip/seat và RPC tạo booking PENDING/lock 10 phút.

Có file migration trong workspace **không chứng minh migration đã chạy ở Supabase live**. Xác minh trạng thái triển khai qua migration history/dashboard của môi trường tương ứng; không suy đoán từ `.env.local`.

## Design và page rules

- Chi tiết layout/component props, Design Tokens và quy tắc chuyển Stitch: `.github/instructions/new-page.instructions.md`.
- Không dựng Header/Footer riêng cho page; sử dụng layout route group sẵn có.
- `src/app/globals.css` định nghĩa `surface`, `primary-container`, `secondary-container`, `outline`, `error` và theme fonts.

## An toàn môi trường

- Không đọc, in, ghi lại hoặc commit giá trị `.env.local`/secrets trong tài liệu.
- Biến public Supabase dùng trong browser có tiền tố `NEXT_PUBLIC_`; service-role key chỉ dành cho server đáng tin cậy.
- Không chạy migration hoặc thay đổi dữ liệu môi trường thật nếu chưa được yêu cầu.
- Trước khi sửa, kiểm tra trạng thái thay đổi hiện có; không ghi đè thay đổi không thuộc task.

