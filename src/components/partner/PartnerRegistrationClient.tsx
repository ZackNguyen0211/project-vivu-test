"use client";

import React, { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const FEATURES = [
  {
    icon: "dashboard_customize",
    title: "Hệ thống Quản trị Nhà xe",
    description:
      "Quản lý sơ đồ ghế, lịch chạy và doanh thu trực tiếp theo thời gian thực. Ngăn trùng vé và bán đè ghế.",
  },
  {
    icon: "account_balance",
    title: "Đối soát và dòng tiền T+1",
    description:
      "Doanh thu VietQR và ví MoMo được đối soát minh bạch rồi chuyển về tài khoản ngân hàng nhà xe.",
  },
  {
    icon: "qr_code_scanner",
    title: "Vé điện tử QR và thông báo",
    description:
      "Hành khách nhận vé QR tự động và nhân viên quét mã nhanh để check-in trên chuyến.",
  },
  {
    icon: "campaign",
    title: "Marketing và quảng bá thương hiệu",
    description:
      "Nhà xe được giới thiệu trên trang chủ, chiến dịch ưu đãi và mạng lưới thành viên ViVuClub.",
  },
];

const STEPS = [
  ["Mất 2 phút", "Điền biểu mẫu", "Cung cấp tên nhà xe, tuyến trọng điểm và quy mô đội xe."],
  ["Trong 24 giờ", "Thẩm định hồ sơ", "Chuyên viên khu vực tư vấn giải pháp và hợp đồng điện tử."],
  ["Miễn phí", "Thiết lập và đào tạo", "Hỗ trợ nhập xe, cấu hình ghế và hướng dẫn nhân viên vận hành."],
  ["Khởi hành", "Mở bán vé", "Tuyến chính thức được mở bán công khai trên ViVuCoach."],
];

const FAQS = [
  [
    "Chi phí gia nhập và phí dịch vụ là bao nhiêu?",
    "ViVuCoach không thu phí khởi tạo và phí đào tạo ban đầu. Nhà xe chỉ chia sẻ hoa hồng theo vé đặt thành công.",
  ],
  [
    "Nhà xe chưa từng dùng phần mềm quản lý vé có tham gia được không?",
    "Hoàn toàn được. ViVuCoach hỗ trợ 1 kèm 1 và hướng dẫn trên máy tính hoặc điện thoại.",
  ],
  [
    "Nhân viên kiểm soát vé điện tử bằng cách nào?",
    "Nhân viên quét mã QR trong cổng nhà xe hoặc đối chiếu thông tin hành khách trên danh sách chuyến.",
  ],
  [
    "Tiền bán vé online được thanh toán khi nào?",
    "Doanh thu được đối soát T+1 vào ngày làm việc tiếp theo và chuyển về tài khoản chính chủ của nhà xe.",
  ],
];

export default function PartnerRegistrationClient() {
  const [brandName, setBrandName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fleetSize, setFleetSize] = useState("1-5");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busCount, setBusCount] = useState(10);
  const [tripsPerDay, setTripsPerDay] = useState(2);
  const [ticketPrice, setTicketPrice] = useState(280);

  const revenue = useMemo(() => {
    const extraSeatsPerTrip = 6;
    const monthly = busCount * tripsPerDay * extraSeatsPerTrip * ticketPrice * 1000 * 30 * 0.12;
    return Math.round(monthly / 1000000) * 1000000;
  }, [busCount, tripsPerDay, ticketPrice]);

  const calculatorFields: Array<{
    label: string;
    value: number;
    min: number;
    max: number;
    setter: React.Dispatch<React.SetStateAction<number>>;
    shown: string;
    low: string;
    high: string;
  }> = [
    {
      label: "Quy mô đội xe khai thác",
      value: busCount,
      min: 1,
      max: 50,
      setter: setBusCount,
      shown: `${busCount} Xe`,
      low: "1 xe",
      high: "50+ xe",
    },
    {
      label: "Số chuyến xuất bến/ngày/xe",
      value: tripsPerDay,
      min: 1,
      max: 6,
      setter: setTripsPerDay,
      shown: `${tripsPerDay} Chuyến`,
      low: "1 chuyến",
      high: "6 chuyến",
    },
    {
      label: "Giá vé trung bình",
      value: ticketPrice,
      min: 150,
      max: 600,
      setter: setTicketPrice,
      shown: `${ticketPrice.toLocaleString("vi-VN")}.000₫`,
      low: "150.000₫",
      high: "600.000₫",
    },
  ];

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const callbackUrl = new URL("/api/auth/callback", window.location.origin);
      callbackUrl.searchParams.set("redirect", "/partner/register");
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callbackUrl.toString() },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể mở đăng nhập Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (password.length < 8) throw new Error("Mật khẩu phải có ít nhất 8 ký tự.");
      const supabase = createClient();
      const { data: existing } = await supabase.auth.getUser();

      if (!existing.user) {
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: brandName,
              phone,
              role: "USER",
            },
          },
        });
        if (signupError) throw signupError;

        if (!data.session) {
          setMessage("Tài khoản đã được tạo. Vui lòng xác nhận email, sau đó hồ sơ đối tác sẽ được lưu.");
        }
      }

      const { error: rpcError } = await supabase.rpc("submit_partner_application", {
        p_brand_name: brandName,
        p_phone: phone,
        p_email: email,
        p_fleet_size: fleetSize,
      });
      if (rpcError) throw rpcError;

      setMessage(
        "Hồ sơ đối tác đã được gửi thành công. Chuyên viên ViVuCoach sẽ liên hệ trong 24 giờ làm việc."
      );
      setBrandName("");
      setPhone("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể gửi hồ sơ đối tác.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <section className="relative overflow-hidden bg-primary-container text-on-primary">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-secondary-container/15 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-tertiary-fixed-dim/20 blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-highest/20 text-secondary-fixed mb-5">
                <span className="material-symbols-outlined text-secondary-container text-lg">verified</span>
                <span className="text-xs font-bold uppercase tracking-wide">Đồng hành cùng 500+ nhà xe uy tín</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.08] tracking-tight">
                Tăng trưởng doanh thu cùng <span className="text-secondary-container">ViVuCoach</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base lg:text-lg leading-relaxed text-surface-dim">
                Mở rộng kênh bán vé trực tuyến, quản lý sơ đồ ghế và nhận dòng tiền thanh toán minh bạch.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <a href="#dang-ky-form" className="h-12 px-6 rounded-xl bg-secondary-container text-primary-container font-bold flex items-center justify-center gap-2">
                  Đăng ký đối tác miễn phí
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </a>
                <a href="#tms-demo" className="h-12 px-6 rounded-xl bg-white/10 hover:bg-white/15 font-bold flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container">devices</span>
                  Tìm hiểu hệ thống TMS
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
                {[
                  ["5.000.000+", "Hành khách"],
                  ["+35%", "Doanh thu"],
                  ["0 VNĐ", "Phí thiết lập"],
                  ["24/7", "Hỗ trợ"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-xl bg-white/10 p-4">
                    <div className="font-display text-xl sm:text-2xl font-extrabold text-secondary-container">{value}</div>
                    <div className="mt-1 text-xs text-on-primary-container">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-surface-container-lowest text-on-surface p-5 shadow-xl">
                <div className="flex items-center justify-between pb-4">
                  <span className="text-xs font-bold text-on-surface-variant">ViVuCoach TMS Live Desk</span>
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-surface-container">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse" />
                    Real-time
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low mb-4">
                  <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                    <span>22:30 • Sài Gòn ⇄ Đà Lạt</span>
                    <span className="text-secondary">94%</span>
                  </div>
                  <div className="h-2 mt-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full w-[94%] rounded-full bg-secondary-container" />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-on-surface-variant">
                    <span>32/34 ghế</span>
                    <span className="font-bold text-on-surface">14.280.000₫</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {["A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08"].map((seat, index) => (
                    <div
                      key={seat}
                      className={`h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                        index === 3
                          ? "bg-secondary-container text-primary-container"
                          : index === 5
                            ? "bg-white border border-outline-variant"
                            : "bg-surface-container-high/60 text-on-surface-variant"
                      }`}
                    >
                      {seat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="dang-ky-form" className="w-full py-14 lg:py-20 bg-surface">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">Gia nhập ViVuCoach</span>
            <h2 className="mt-1 font-display text-3xl lg:text-[2.25rem] font-bold">Đăng ký trở thành Nhà xe đối tác</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Chuyên viên khu vực sẽ liên hệ tư vấn và hỗ trợ thiết lập gian hàng trong 24 giờ làm việc.
            </p>
          </div>

          <div className="max-w-2xl mx-auto rounded-3xl border border-surface-container bg-surface-container-lowest p-6 lg:p-8 shadow-xl">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">Cổng đối tác Nhà xe</span>
              <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold">Tạo tài khoản gian hàng</h3>
              <p className="mt-1 text-xs text-on-surface-variant">Thiết lập gian hàng mở bán vé trực tuyến và quản lý đội xe.</p>
            </div>

            <button type="button" onClick={handleGoogle} disabled={loading} className="mt-6 w-full h-12 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low font-bold text-sm flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              Đăng ký nhanh với Google Doanh nghiệp
            </button>

            <div className="my-5 flex items-center">
              <div className="h-px flex-1 bg-surface-container" />
              <span className="px-3 text-xs text-on-surface-variant">Hoặc tạo tài khoản bằng Email</span>
              <div className="h-px flex-1 bg-surface-container" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">{error}</div>}
              {message && <div className="rounded-xl bg-secondary-fixed px-4 py-3 text-sm font-bold text-on-secondary-fixed">{message}</div>}

              <div>
                <label htmlFor="bus-brand" className="block text-xs font-bold mb-1">Tên Nhà xe / Thương hiệu *</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">directions_bus</span>
                  <input id="bus-brand" required value={brandName} onChange={(event) => setBrandName(event.target.value)} placeholder="Nhà xe Hoàng Long, An Phú Bus..." className="w-full h-12 pl-10 pr-4 rounded-xl bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-secondary-container text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bus-phone" className="block text-xs font-bold mb-1">Số điện thoại quản lý *</label>
                  <input id="bus-phone" required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="09xx xxx xxx" className="w-full h-12 px-4 rounded-xl bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-secondary-container text-sm" />
                </div>
                <div>
                  <label htmlFor="bus-email" className="block text-xs font-bold mb-1">Email quản lý *</label>
                  <input id="bus-email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@nhaxe.vn" className="w-full h-12 px-4 rounded-xl bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-secondary-container text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="bus-password" className="block text-xs font-bold mb-1">Mật khẩu quản trị *</label>
                <div className="relative">
                  <input id="bus-password" required minLength={8} type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Tối thiểu 8 ký tự" className="w-full h-12 px-4 pr-12 rounded-xl bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-secondary-container text-sm" />
                  <button type="button" aria-label="Hiện mật khẩu" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold mb-2">Quy mô đội xe</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["1-5", "1 - 5 xe"],
                    ["6-15", "6 - 15 xe"],
                    ["gt15", "> 15 xe"],
                  ].map(([value, label]) => (
                    <label key={value} className={`h-11 rounded-xl border flex items-center justify-center text-xs font-bold cursor-pointer ${fleetSize === value ? "border-secondary-container bg-secondary-fixed/40" : "border-surface-container bg-surface-container-low"}`}>
                      <input className="sr-only" type="radio" name="fleetSize" value={value} checked={fleetSize === value} onChange={() => setFleetSize(value)} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full h-14 rounded-xl bg-secondary-container text-primary-container font-bold flex items-center justify-center gap-2 shadow-lg">
                <span className="material-symbols-outlined">rocket_launch</span>
                {loading ? "Đang gửi hồ sơ..." : "Tạo tài khoản Nhà xe"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="w-full py-14 lg:py-20 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">Hiệu quả doanh thu thực tế</span>
            <h2 className="mt-2 font-display text-3xl font-bold leading-tight">Ước tính doanh thu tăng thêm</h2>
            <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
              Công cụ mô phỏng giúp nhà xe thấy tác động của quy mô đội xe, tần suất chuyến và mức giá vé trung bình.
            </p>
          </div>
          <div className="lg:col-span-7 rounded-2xl bg-surface-container-lowest p-6 lg:p-8 shadow-lg space-y-6">
            {calculatorFields.map(({ label, value, min, max, setter, shown, low, high }) => (
              <div key={label}>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="font-bold">{label}</span>
                  <span className="font-display text-lg font-bold text-secondary">{shown}</span>
                </div>
                <input type="range" min={min} max={max} value={value} onChange={(event) => setter(Number(event.target.value))} className="w-full accent-secondary-container" />
                <div className="mt-1 flex justify-between text-[11px] text-on-surface-variant"><span>{low}</span><span>{high}</span></div>
              </div>
            ))}
            <div className="rounded-xl bg-primary-container text-on-primary p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase text-on-primary-container">Doanh thu tăng thêm/ tháng</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-secondary-container">+{revenue.toLocaleString("vi-VN")}₫</div>
              </div>
              <a href="#dang-ky-form" className="h-11 px-5 rounded-lg bg-surface-container-lowest text-primary-container text-sm font-bold flex items-center justify-center">
                Hiện thực hóa doanh số
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="tms-demo" className="w-full py-14 lg:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">Nền tảng công nghệ toàn diện</span>
            <h2 className="mt-2 font-display text-3xl lg:text-[2.25rem] font-bold">4 đặc quyền khi tham gia ViVuCoach</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-surface-container bg-surface-container-lowest p-6 lg:p-8 shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-secondary-fixed/50 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold">{feature.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-on-surface-variant">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-14 lg:py-20 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">Tiến trình triển khai</span>
            <h2 className="mt-2 font-display text-3xl lg:text-[2.25rem] font-bold">Quy trình 4 bước gia nhập</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {STEPS.map(([time, title, description], index) => (
              <div key={title} className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${index === 0 ? "bg-secondary-container text-primary-container" : "bg-surface-container text-primary-container"}`}>{index + 1}</div>
                <span className="mt-4 block text-xs font-bold uppercase text-secondary">{time}</span>
                <h3 className="mt-1 font-display text-lg font-bold">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-on-surface-variant">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-14 lg:py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">Giải đáp thắc mắc</span>
            <h2 className="mt-2 font-display text-3xl lg:text-[2.25rem] font-bold">Câu hỏi thường gặp dành cho Nhà xe</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(([question, answer], index) => (
              <details key={question} open={index === 0} className="group rounded-xl border border-surface-container bg-surface-container-lowest p-5 shadow-sm">
                <summary className="list-none cursor-pointer flex items-center justify-between gap-4 font-bold">
                  <span>{question}</span>
                  <span className="material-symbols-outlined text-on-surface-variant transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-14 lg:py-20 bg-primary-container text-on-primary">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="rounded-3xl bg-white/10 p-6 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-flex px-3 py-1 rounded-full bg-secondary-container text-primary-container text-xs font-bold uppercase">Đồng hành dài lâu</span>
              <h2 className="mt-4 font-display text-3xl lg:text-4xl font-extrabold leading-tight">Sẵn sàng bứt phá doanh thu cùng ViVuCoach?</h2>
              <p className="mt-3 text-sm lg:text-base leading-relaxed text-on-primary-container">
                Đăng ký chỉ mất vài phút. Đội ngũ ViVuCoach sẽ hỗ trợ khảo sát và triển khai tại bến xe.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
              <a href="#dang-ky-form" className="h-14 px-6 rounded-xl bg-secondary-container text-primary-container font-bold flex items-center justify-center gap-2">
                Nộp hồ sơ đối tác
                <span className="material-symbols-outlined">chevron_right</span>
              </a>
              <a href="tel:0938123456" className="h-14 px-6 rounded-xl bg-surface-container-lowest text-primary-container font-bold flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-secondary">support_agent</span>
                Gọi tư vấn 0938 123 456
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
