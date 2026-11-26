# **DOCUMENT FOR VIVUCOACH: TÀI LIỆU ĐỊNH HƯỚNG & KIẾN TRÚC KỸ THUẬT**

# **1\. Mục Tiêu & Phạm Vi Dự Án (Project Scope & Boundaries)**

Dự án tập trung xây dựng nền tảng đặt vé xe khách trực tuyến đa nhà xe (Multi-operator Coach Booking Platform) phục vụ đồ án môn học với tiêu chí: **Luồng nghiệp vụ chuẩn chỉnh, tích hợp dịch vụ thực tế (OAuth, Payment, Email) và loại bỏ các tính năng rườm rà ngoài phạm vi cốt lõi**.

## **1.1. Các tính năng cốt lõi (In-Scope \- Bắt buộc hoàn thành)**

* **Xác thực người dùng:** Đăng nhập nhanh qua Google OAuth2 (Gmail), tự động đồng bộ lịch sử đặt vé qua địa chỉ Email.  
* **Luồng đặt vé trực tuyến (Online Booking Flow):** Tìm kiếm chuyến xe, chọn ghế trực quan trên sơ đồ (Seat Map), chọn điểm đón/trả.  
* **Cơ chế giữ chỗ chống trùng lặp (Concurrency Seat Locking):** Khóa ghế tạm thời 10 phút khi chuyển sang bước thanh toán.  
* **Thanh toán thực tế (Sandbox/Real Flow):**  
  * Tích hợp cổng thanh toán **MoMo Sandbox** (xử lý tự động qua IPN Webhook).  
  * Tích hợp **VietQR (qua SePay Sandbox)**: Tạo mã QR động chứa số tiền và mã đơn vé (`booking_code`), sử dụng môi trường Sandbox của SePay để mô phỏng giao dịch chuyển khoản và bắn Webhook xác nhận thanh toán tự động.  
* **Vé điện tử & Quản lý vé:** Xuất vé kèm mã QR gửi qua Email tự động sau khi thanh toán; quản lý và hủy vé trực tiếp trên Web (khi đã đăng nhập).  
* **Phân hệ Nhà xe (Operator) & Quản trị hệ thống (System Admin):** Đầy đủ luồng tạo xe, tuyến, lịch chạy, xem phơi xe và quét QR check-in lên xe.

## **1.2. Các tính năng lược bỏ (Out-of-Scope \- Tránh lệch hướng)**

* Không làm nghiệp vụ bán vé tiền mặt tại quầy (Offline POS) hoặc thanh toán khi lên xe (COD).  
* Không làm hệ thống tự thiết kế sơ đồ ghế kéo-thả (chỉ sử dụng 2-3 mẫu JSON Layout cố định như Limousine 22 phòng, Giường nằm 36 chỗ, Ghế ngồi 45 chỗ).  
* Không làm chức năng đặt vé khứ hồi 2 chiều trong cùng 1 giao dịch (khách đặt từng chiều độc lập).  
* Không làm module quản lý tài xế, phụ xe và đối soát kế toán đa cấp phức tạp.

## **1.3. Công Nghệ Sử Dụng (Technology Stack \- ViVuCoach)**

* **UI/UX Design:** Bản thiết kế giao diện Figma hoàn chỉnh cho các phân hệ (được khởi tạo bằng công cụ AI UI **Stitch.io**), sẵn sàng chuyển đổi sang React/Tailwind CSS components.  
* **Fullstack Framework (Frontend & Backend):** **Next.js (App Router \+ TypeScript)** xử lý đồng thời giao diện người dùng (Server & Client Components) và hệ thống API Backend (Route Handlers `app/api/...` & Server Actions).  
* **Database & Authentication:** **Supabase**  
  * **Supabase PostgreSQL:** Cơ sở dữ liệu quan hệ lưu trữ toàn bộ 10 bảng cốt lõi, hỗ trợ Transaction/Row-level locking và `pg_cron` (hoặc Vercel Cron) để giải phóng ghế quá hạn.  
  * **Supabase Auth (hoặc NextAuth/Auth.js kết nối Supabase):** Xác thực **Google OAuth 2.0** và quản lý phiên đăng nhập qua **HttpOnly Cookie**.  
* **Hosting & Deployment:** **Vercel** (Tự động CI/CD từ GitHub, chạy Serverless Functions cho API và Webhooks).  
* **Third-Party Services:** **MoMo Sandbox** (IPN Webhook), **SePay Sandbox** (VietQR & Webhook biến động số dư), **Resend / Nodemailer** (Gửi Email vé điện tử kèm QR Code).

---

# **2\. Phân Quyền & Luồng Người Dùng (Actors & User Flows)**

## **2.1. Ma trận 4 nhóm người dùng**

| Vai trò | Phân quyền & Chức năng chính | Luồng nghiệp vụ đặc trưng |
| :---- | :---- | :---- |
| **Guest** | Chưa đăng nhập hệ thống | Tìm kiếm chuyến \$\\rightarrow\$ Chọn ghế & điểm đón/trả \$\\rightarrow\$ Nhập Họ tên, SĐT, Email \$\\rightarrow\$ Thanh toán (MoMo/VietQR) \$\\rightarrow\$ Nhận vé điện tử (QR Code) và link tra cứu vé qua Email. |
| **Member** | Đã đăng nhập bằng Gmail | Tìm kiếm & đặt vé (Auto-fill thông tin từ Google Profile) \$\\rightarrow\$ Thanh toán \$\\rightarrow\$ Nhận vé qua Email & Quản lý danh sách vé trong mục "Vé của tôi" trên Web \$\\rightarrow\$ Chủ động yêu cầu Hủy vé (nếu trước giờ khởi hành 24h). |
| **Operator Manager** | Quản lý Nhà xe | Quản lý Đội xe (gán Seat Layout) \$\\rightarrow\$ Quản lý Tuyến & Điểm đón/trả \$\\rightarrow\$ Lên lịch chạy (Trips) & Mở bán \$\\rightarrow\$ Xem sơ đồ ghế trực tiếp \$\\rightarrow\$ Quét mã QR vé của khách để Check-in khi lên xe. |
| **System Admin** | Quản trị toàn bộ hệ thống | Quản lý danh mục Tỉnh/Thành phố & Bến xe chuẩn \$\\rightarrow\$ Duyệt/Cấp quyền tài khoản Nhà xe \$\\rightarrow\$ Giám sát toàn bộ giao dịch thanh toán \$\\rightarrow\$ Xác nhận hoàn tiền (Refund) cho các đơn hủy hợp lệ \$\\rightarrow\$ Xem Dashboard thống kê toàn sàn. |

## **2.2. Nghiệp vụ đặc biệt: Tự động liên kết vé (Account Linking)**

Khi người dùng đặt vé ở chế độ **Guest** bằng email `user@gmail.com` (`user_id = NULL`), sau đó đăng nhập hệ thống bằng tài khoản Google user@gmail.com, hệ thống tự động truy vấn và hiển thị toàn bộ các vé đã đặt trước đó dựa trên trường customer\_email khớp với email tài khoản.

---

# **3\. Vòng Đời Đơn Vé & Cơ Chế Giữ Chỗ (State Machine & Seat Locking)**

## **3.1. Sơ đồ trạng thái đơn vé (Booking Status Lifecycle)**

Mọi đơn đặt vé (Bookings) trong hệ thống chỉ đi qua 6 trạng thái chuẩn sau:

1. **PENDING (Đang giữ chỗ):** Khởi tạo ngay khi khách bấm "Thanh toán". Các ghế được chọn bị khóa tạm thời trong 10 phút (`expired_at = created_at + 10 phút`).  
2. **PAID (Đã thanh toán):** Cập nhật khi nhận Webhook thành công từ MoMo hoặc VietQR. Hệ thống sinh mã QR và bắn Email vé điện tử cho khách.  
3. **EXPIRED (Hết hạn giữ chỗ):** Sau 10 phút nếu đơn vẫn ở trạng thái `PENDING`, đơn chuyển sang `EXPIRED` và giải phóng ghế cho người khác đặt.  
4. **CHECKED\_IN (Đã lên xe):** Nhà xe quét mã QR xác nhận khách đã sử dụng vé.  
5. **CANCELLED\_PENDING\_REFUND (Chờ hoàn tiền):** Khách hủy vé hợp lệ trên web; ghế được mở bán lại ngay lập tức, đơn chờ Admin xác nhận hoàn tiền.  
6. **REFUNDED (Đã hoàn tiền):** Admin hệ thống xác nhận đã hoàn trả tiền cho khách.

## **3.2. Giải pháp kỹ thuật xử lý giữ ghế 10 phút (Không cần hạ tầng phức tạp)**

* **Kiểm tra trạng thái ghế tức thời (Lazy Evaluation):** Một ghế trên chuyến xe được xác định là **Đang bị chiếm (Unavailable)** khi thuộc về một Booking có:  
  `status IN ('PAID', 'CHECKED_IN') OR (status = 'PENDING' AND expired_at > NOW())`  
  Nhờ công thức này, đúng giây thứ 601 khi quá hạn, ghế tự động hiển thị trống cho người dùng khác chọn mà không bị phụ thuộc vào độ trễ của Cronjob.  
* **Chống tranh chấp đồng thời (Race Condition):** Sử dụng Database Transaction kết hợp khóa dòng (`SELECT ... FOR UPDATE`) hoặc ràng buộc Unique Index có điều kiện khi tạo Booking để đảm bảo 2 người bấm cùng lúc không thể đặt trùng 1 ghế.  
* **Background Cronjob:** Chạy định kỳ mỗi 5 phút để cập nhật các bản ghi `PENDING` có `expired_at <= NOW()` sang trạng thái `EXPIRED` nhằm làm sạch dữ liệu.

---

# **4\. Kiến Trúc Cơ Sở Dữ Liệu Cốt Lõi (Core Database Schema)**

Hệ thống sử dụng cơ sở dữ liệu quan hệ (PostgreSQL hoặc MySQL) với 10 bảng cốt lõi sau:

| Tên Bảng | Các Trường Cốt Lõi (Columns) | Mô Tả & Khóa Ngoại (FK) |
| :---- | :---- | :---- |
| **users** | `id`, `email`, `full_name`, `phone`, `avatar_url`, `google_id`, `role`, `operator_id`, `created_at` | Tài khoản hệ thống. `email` Unique. `role`: `USER`, `OPERATOR`, `ADMIN`. `operator_id` (FK nullable). |
| **operators** | `id`, `name`, `hotline`, `description`, `logo_url`, `status`, `created_at` | Thông tin Nhà xe. `status`: `ACTIVE`, `INACTIVE`. |
| **locations** | `id`, `province_name`, `station_name`, `address`, `type` | Tỉnh/Thành & Bến xe. `type`: `PICKUP`, `DROPOFF`, `BOTH`. |
| **routes** | `id`, `operator_id`, `departure_province`, `destination_province`, `estimated_duration_minutes`, `base_price` | Tuyến đường của nhà xe. `operator_id` (FK). |
| **route\_stops** | `id`, `route_id`, `location_id`, `stop_type`, `offset_minutes` | Điểm đón/trả chi tiết theo tuyến. `route_id` (FK), `location_id` (FK). `stop_type`: `PICKUP`, `DROPOFF`. |
| **coaches** | `id`, `operator_id`, `license_plate`, `coach_type`, `seat_layout_json`, `status` | Đội xe. `operator_id` (FK). `coach_type`: `LIMOUSINE_22`, `SLEEPER_36`, `SEATER_45`. |
| **trips** | `id`, `route_id`, `coach_id`, `departure_time`, `arrival_time`, `ticket_price`, `status` | Chuyến xe mở bán. `route_id` (FK), `coach_id` (FK). `status`: `SCHEDULED`, `COMPLETED`, `CANCELLED`. |
| **bookings** | `id`, `booking_code`, `trip_id`, `user_id`, `customer_name`, `customer_phone`, `customer_email`, `pickup_stop_id`, `dropoff_stop_id`, `total_amount`, `status`, `qr_token`, `expired_at`, `created_at` | Đơn đặt vé. `booking_code` Unique. `trip_id` (FK), `user_id` (FK nullable), `pickup_stop_id` (FK), `dropoff_stop_id` (FK). |
| **booking\_seats** | `id`, `booking_id`, `trip_id`, `seat_code`, `price` | Chi tiết ghế trong đơn. `booking_id` (FK), `trip_id` (FK). `seat_code` (VD: `A01`, `B02`). |
| **payments** | `id`, `booking_id`, `provider`, `transaction_id`, `amount`, `status`, `raw_webhook_payload`, `paid_at` | Lịch sử giao dịch thanh toán. `booking_id` (FK). `provider`: `MOMO`, `SEPAY_VIETQR`. |

---

# **5\. Kiến Trúc Tích Hợp Dịch Vụ Bên Ngoài (Third-Party Integrations)**

* **Google OAuth 2.0:** Xác thực người dùng ở Frontend/Backend, lấy `email`, `name`, `picture` từ Google ID Token để khởi tạo hoặc đăng nhập phiên làm việc (JWT / Session).  
* **MoMo Sandbox API:**  
  * Gọi API tạo Payment URL với `orderId`, `amount`, `redirectUrl` (quay về trang kết quả trên Web) và `ipnUrl` (Endpoint Backend nhận kết quả ngầm).  
  * Kiểm tra chữ ký điện tử (`HMAC_SHA256` signature) trong IPN Webhook trước khi cập nhật trạng thái đơn sang `PAID`.  
* **VietQR Integration (SePay Sandbox):**  
  * Sử dụng cấu trúc chuẩn VietQR (`https://qr.sepay.vn/img?bank=<BANK_NAME>&acc=<ACCOUNT_NO>&template=compact&amount=<AMOUNT>&des=<BOOKING_CODE>`) để hiển thị mã QR động tức thì.  
  * Sử dụng **SePay Sandbox** để mô phỏng giao dịch biến động số dư: kích hoạt giao dịch giả lập trên SePay Sandbox \$\\rightarrow\$ SePay bắn Webhook (kèm API Key / Bearer Token xác thực trong Header) về Backend \$\\rightarrow\$ Backend bóc tách `booking_code` từ nội dung chuyển khoản (`content`), kiểm tra khớp số tiền (`transferAmount == total_amount`) và tự động chuyển trạng thái đơn sang `PAID`.  
* **Email Service (Nodemailer / Resend / SMTP Gmail):**  
  * Tự động render HTML Email Template có nhúng ảnh mã QR (sinh từ `booking_code` \+ `qr_token`) và gửi cho `customer_email` ngay sau khi đơn chuyển sang `PAID`.

---

# **6\. Kiến Trúc Kỹ Thuật Next.js, Phân Quyền (RBAC) & Hệ Thống API**

## **6.1. Nhóm API theo Phân quyền (RESTful Endpoints)**

* **Public & Booking APIs (`/api/v1/public/...` & `/api/v1/bookings/...`):**  
  * `GET /trips/search`: Tìm kiếm và lọc chuyến xe.  
  * `GET /trips/:id/seats`: Lấy sơ đồ ghế và trạng thái ghế thực tế của chuyến.  
  * `POST /bookings`: Tạo đơn đặt vé \+ Khóa ghế 10 phút \+ Trả về URL MoMo / Dữ liệu VietQR.  
  * `GET /bookings/lookup`: Tra cứu vé bằng `booking_code` \+ `token` (cho Guest từ Email).  
* **Member APIs (`/api/v1/me/...` \- Yêu cầu Login):**  
  * `GET /me/bookings`: Lấy danh sách vé (gộp theo `user_id` và `customer_email`).  
  * `POST /me/bookings/:id/cancel`: Yêu cầu hủy vé trước giờ khởi hành.  
* **Payment Webhook APIs (`/api/v1/webhooks/...`):**  
  * `POST /webhooks/momo`: Nhận IPN từ MoMo Sandbox.  
  * `POST /webhooks/sepay`: Nhận Webhook biến động số dư từ SePay Sandbox để xác nhận thanh toán VietQR tự động.  
* **Operator APIs (`/api/v1/operator/...` \- Role OPERATOR):**  
  * CRUD `/coaches`, `/routes`, `/trips`.  
  * `GET /trips/:id/manifest`: Xem danh sách hành khách trên chuyến.  
  * `POST /bookings/check-in`: Quét mã QR soát vé lên xe.  
* **Admin APIs (`/api/v1/admin/...` \- Role ADMIN):**  
  * CRUD `/locations`, `/operators`.  
  * `POST /bookings/:id/refund`: Xác nhận đã hoàn tiền cho khách.  
  * `GET /stats/overview`: Thống kê doanh thu và sản lượng vé toàn sàn.

## **6.2. Kiến trúc Single-Project & Path-based Routing**

Toàn bộ hệ thống **ViVuCoach** được triển khai trong **1 dự án Next.js duy nhất** (Monolithic Fullstack) trên cùng một tên miền (VD: `vivucoach.vercel.app`), phân tách không gian làm việc theo đường dẫn (Path-based Routing):

* **Khách hàng (Guest & Member):** `/`, `/search`, `/checkout`, `/me/bookings`  
* **Quản lý Nhà xe (Operator Dashboard):** `/operator/dashboard`, `/operator/coaches`, `/operator/routes`, `/operator/trips`, `/operator/check-in`  
* **Quản trị Hệ thống (Admin Dashboard):** `/admin/dashboard`, `/admin/locations`, `/admin/operators`, `/admin/refunds`

## **6.3. Cơ chế Quản lý Session Cookie & Phân quyền (Middleware RBAC)**

* **Single HttpOnly Session Cookie:** Sử dụng 1 Cookie phiên làm việc duy nhất (`Path=/`) cho toàn bộ domain. Sau khi đăng nhập Google OAuth, hệ thống đối chiếu email trong bảng `users` để lấy `role` (`USER`, `OPERATOR`, `ADMIN`) và `operator_id`.  
* **Next.js Middleware (`src/middleware.ts`):** Đóng vai trò Route Guard chặn trước mọi request:  
  * Chưa đăng nhập truy cập `/me/*`, `/operator/*`, `/admin/*` \$\\rightarrow\$ Redirect về `/login?redirect=...`.  
  * Truy cập `/admin/*` nhưng `user.role !== 'ADMIN'` \$\\rightarrow\$ Chặn và chuyển hướng sang trang `403 Forbidden`.  
  * Truy cập `/operator/*` nhưng `user.role !== 'OPERATOR'` \$\\rightarrow\$ Chặn và chuyển hướng sang trang `403 Forbidden`.  
* **Bảo mật tầng API (Data Isolation cho Nhà xe):** Trong các API `/api/v1/operator/*`, Backend luôn trích xuất `operator_id` trực tiếp từ Session/Token đã xác thực của người dùng (không nhận từ request body/query) để đảm bảo Nhà xe A không thể can thiệp dữ liệu của Nhà xe B.  
* **Điều hướng thông minh sau đăng nhập (Smart Redirect):** Khi đăng nhập thành công tại `/login`, hệ thống tự động chuyển hướng `ADMIN` về `/admin/dashboard`, `OPERATOR` về `/operator/dashboard`, và `USER` về trang chủ `/` (hoặc trang đang đặt vé dở).

## **6.4. Cấu trúc thư mục Next.js App Router (Chuẩn hóa theo Figma Stitch.io)**

* `src/app/(customer)/`: Nhóm trang Khách hàng (dùng chung Navbar \+ Footer).  
* `src/app/operator/`: Nhóm trang Quản lý Nhà xe (dùng chung Operator Sidebar Layout).  
* `src/app/admin/`: Nhóm trang Quản trị viên (dùng chung Admin Sidebar Layout).  
* `src/app/api/v1/`: Toàn bộ RESTful Route Handlers (`public`, `bookings`, `me`, `operator`, `admin`, `webhooks/momo`, `webhooks/sepay`).  
* `src/lib/supabase/`: Khởi tạo Supabase Client (Browser Client, Server Client với Cookie, và Service Role Admin Client cho Webhook).  
* `src/middleware.ts`: Xử lý làm mới phiên Supabase Auth và kiểm tra phân quyền RBAC.

---

# **7\. Lộ Trình Triển Khai 5 Giai Đoạn (Implementation Roadmap)**

Để không bị ngợp và đảm bảo luôn có sản phẩm chạy được qua từng tuần, hãy bám sát thứ tự sau:

* **Milestone 1: Khởi tạo Project Next.js \+ Supabase, UI Components & Master Data (Tuần 1\)**  
  * Khởi tạo project Next.js \+ Supabase, chuyển đổi thiết kế Figma Stitch.io thành các UI layout components dùng chung cho Customer, Operator và Admin. Thiết lập Database Schema, tích hợp Google Login, phân quyền Middleware (`USER`, `OPERATOR`, `ADMIN`).  
  * Làm trang Admin tạo Tỉnh/Thành phố và trang Nhà xe tạo Xe (kèm JSON sơ đồ ghế mẫu), Tuyến đường, Chuyến xe.  
* **Milestone 2: Luồng Tìm kiếm, Sơ đồ ghế & Giữ chỗ (Tuần 2\)**  
  * Xây dựng trang tìm kiếm chuyến xe, hiển thị sơ đồ ghế trực quan.  
  * Hoàn thiện API tạo Booking ở trạng thái `PENDING` có khóa ghế 10 phút và xử lý chống đặt trùng.  
* **Milestone 3: Tích hợp Thanh toán MoMo Sandbox, VietQR & Email Vé (Tuần 3\)**  
  * Nối luồng thanh toán MoMo Sandbox \+ VietQR (SePay Sandbox).  
  * Viết hàm xử lý Webhook chuyển trạng thái `PAID` \$\\rightarrow\$ Sinh QR Code \$\\rightarrow\$ Gửi Email vé điện tử.  
* **Milestone 4: Quản lý Vé cá nhân, Hủy vé & Check-in QR cho Nhà xe (Tuần 4\)**  
  * Làm trang "Vé của tôi" cho Member, chức năng Hủy vé \$\\rightarrow\$ Admin duyệt hoàn tiền.  
  * Làm tính năng quét mã QR Check-in cho Nhà xe và Dashboard thống kê doanh thu.  
* **Milestone 5: Kiểm thử kịch bản Demo & Đóng gói (Tuần 5\)**  
  * Chuẩn bị dữ liệu mẫu (Seed Data) đẹp mắt cho 3-4 nhà xe lớn, kiểm thử kịch bản 2 trình duyệt đặt cùng 1 ghế để biểu diễn tính năng Seat Locking khi bảo vệ đồ án.

