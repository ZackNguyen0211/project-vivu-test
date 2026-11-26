---
applyTo: "src/app/**/page.tsx"
---

# Kiến trúc trang mới

## Quy tắc bắt buộc
- Khi tạo hoặc sửa `page.tsx`, PHẢI dùng đúng layout của route group tương ứng: `(customer)`, `admin` hoặc `operator`.
- Tái sử dụng `PortalShell`, `TmsDashboardShell`, `CustomerHeader` hoặc `CustomerFooter`; tuyệt đối không tự tạo Header/Footer mới.
- Không quét lại toàn bộ `src/`; chỉ đọc props chi tiết của component được sử dụng.
- Tách tương tác client sang `*Client.tsx` trong `src/components/<feature>/`.
- `page.tsx` là Server Component; lấy dữ liệu qua `src/services/`.

## Layout route
| Route | Layout | Thành phần |
|---|---|---|
| `src/app/(customer)/layout.tsx` | `CustomerLayout({ children })` | `CustomerHeader`; `<main>`; `CustomerFooter` |
| `src/app/admin/layout.tsx` | `AdminLayout({ children })` | `PortalShell` role admin |
| `src/app/operator/layout.tsx` | `OperatorLayout({ children })` | `PortalShell` role operator |

## Layout components
| Import | Props chính / chức năng |
|---|---|
| `@/components/layout/CustomerHeader` | Không props; header khách hàng |
| `@/components/layout/CustomerFooter` | Không props; footer khách hàng |
| `@/components/layout/BookingStepHeader` | `{ currentStep: 1\|2\|3\|4, routeTitle?, dateLabel? }` |
| `@/components/layout/BookingStepProgress` | `{ currentStep: 1\|2\|3\|4 }` |
| `@/components/layout/PortalShell` | `{ roleTitle, roleSubtitle, navItems: NavItem[], children }` |
| `@/components/layout/TmsDashboardShell` | `{ children }`; shell dashboard legacy |

## Feature components
| Import | Props / chức năng |
|---|---|
| `@/components/home/HeroSearchSection` | `{ locations: LocationItem[] }` |
| `@/components/home/PopularRoutesSection` | `{ initialRoutes: PopularRouteItem[] }` |
| `@/components/home/VoucherSection` | `{ vouchers: VoucherItem[] }` |
| `@/components/home/VerifiedOperatorsSection` | `{ operators: OperatorSummary[] }` |
| `@/components/home/TestimonialsAndCta` | `{ testimonials: TestimonialItem[] }` |
| `@/components/home/ValuePropsSection` | Không props |
| `@/components/search/SearchScheduleClient` | `{ initialTrips, fromCity, toCity, dateStr }` |
| `@/components/seats/SeatSelectionClient` | `{ trip: TripSearchResult, seats: SeatCell[] }` |
| `@/components/checkout/CheckoutPaymentClient` | `{ tripId, seatList, pickupStopId, dropoffStopId, amount }` |
| `@/components/ticket/ElectronicTicketClient` | `{ ticket: ElectronicTicketData }` |
| `@/components/partner/PartnerRegistrationClient` | Không props |
| `@/components/operator/OperatorTripsClient` | `{ initialTrips: OperatorTripRow[] }` |
| `@/components/operator/SeatManifestClient` | `{ initialPassengers: ManifestPassengerRow[] }` |

## Services
| Import | Export chính |
|---|---|
| `@/services/home.service` | `getActiveLocations`, `getPopularRoutes`, `getFeaturedOperators`, `getPromotionalVouchers`, `getCustomerTestimonials` |
| `@/services/booking.service` | `searchAvailableTrips`, `getTripSeatMap`, `getElectronicTicketByCode`, `buildSepayVietQrUrl` |
| `@/services/operator.service` | `getOperatorScheduleTrips`, `getTripManifestPassengers(tripId)` |
| `@/services/admin.service` | `getAdminPlatformOperators`, `getAdminReconciliationPayouts` |

## Libs và types
- Supabase: `@/lib/supabase/client`, `server`, `admin`, `config`.
- Payment: `@/lib/payment/sepay.buildSepayVietQrUrl(params)`.
- Routing: `src/proxy.ts` export `proxy(request)` và `config`.
- Types: `@/types/home`, `booking`, `portal`, `tms`.

## Design Tokens
- Font: `Plus Jakarta Sans` cho `font-display`; `Inter` cho `font-sans`.
- Icon chuẩn hiện tại: Google `Material Symbols Outlined`; dùng class `material-symbols-outlined`/`material-symbols-filled`. Dự án chưa khai báo thư viện React icon trong `package.json`.
- Màu chủ đạo: nền `surface`, container `surface-container-lowest/low/container/high/highest`, chữ `on-surface`/`on-surface-variant`, viền `outline`/`outline-variant`.
- Brand: `primary-container` (nav/header tối), `secondary-container` (vàng/cam `#fd9e00`), `secondary-fixed`, `tertiary-container` và `error`/`error-container`.
- Tailwind theme lấy trực tiếp từ biến CSS trong `src/app/globals.css`; ưu tiên class Tailwind như `bg-primary-container`, `text-secondary-container`, `border-outline-variant/30`.

## Quy tắc chuyển đổi HTML từ Stitch.io
- BẮT BUỘC lược bỏ hoàn toàn `<html>`, `<head>`, `<script>`, `<style>`, `<header>`, `<nav>` và `<footer>` trong mã Stitch.
- Chuyển tất cả icon Material Symbols, FontAwesome hoặc SVG thô sang Material Symbols của dự án; không giữ inline SVG/font icon Stitch.
- Đồng bộ mã màu cứng hex/rgb trong Stitch sang biến màu hoặc class Tailwind tương ứng để khớp `CustomerHeader`, `CustomerFooter` và toàn bộ theme.
