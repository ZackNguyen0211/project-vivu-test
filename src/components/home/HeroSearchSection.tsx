// src/components/home/HeroSearchSection.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LocationItem } from "@/types/home";

interface HeroSearchSectionProps {
  locations: LocationItem[];
}

export default function HeroSearchSection({ locations }: HeroSearchSectionProps) {
  const router = useRouter();

  // 1. Khởi tạo rỗng để tránh gọi new Date() khi Next.js prerender trên server
  const [todayIso, setTodayIso] = useState<string>("");
  const [departureDate, setDepartureDate] = useState<string>("");

  const [origin, setOrigin] = useState<string>(
    locations[0]?.province_name || "TP. Hồ Chí Minh"
  );
  const [destination, setDestination] = useState<string>(
    locations[1]?.province_name || "Đà Lạt (Lâm Đồng)"
  );
  const [seatCount, setSeatCount] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [activePreset, setActivePreset] = useState<string>("today");

  // 2. Lấy ngày hiện tại dưới Client sau khi mount
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const today = new Date().toLocaleDateString("sv-SE");
      setTodayIso(today);
      setDepartureDate((prev) => prev || today);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const originStationNote = useMemo(() => {
    return (
      locations.find((l) => l.province_name === origin)?.station_name ||
      "Bến xe trung tâm / Điểm đón"
    );
  }, [locations, origin]);

  const destStationNote = useMemo(() => {
    return (
      locations.find((l) => l.province_name === destination)?.station_name ||
      "Bến xe trung tâm / Điểm trả"
    );
  }, [locations, destination]);

  const handleSwapRoute = () => {
    setRotation((prev) => prev + 180);
    setOrigin(destination);
    setDestination(origin);
  };

  // 3. Sự kiện click chỉ chạy ở Client nên dùng new Date() thoải mái
  const handleQuickDateSelect = (preset: "today" | "tomorrow" | "saturday" | "sunday") => {
    setActivePreset(preset);
    const target = new Date();

    if (preset === "tomorrow") {
      target.setDate(target.getDate() + 1);
    } else if (preset === "saturday") {
      const day = target.getDay();
      const diff = (6 - day + 7) % 7 || 7;
      target.setDate(target.getDate() + diff);
    } else if (preset === "sunday") {
      const day = target.getDay();
      const diff = (7 - day) % 7 || 7;
      target.setDate(target.getDate() + diff);
    }

    // Dùng sv-SE thay vì toISOString() để giữ đúng múi giờ Việt Nam (UTC+7)
    setDepartureDate(target.toLocaleDateString("sv-SE"));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      from: origin,
      to: destination,
      date: departureDate,
      seats: String(seatCount),
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative w-full -mt-20 overflow-hidden bg-primary-container text-on-primary">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-tertiary-fixed-dim/20 via-secondary-container/15 to-transparent blur-3xl" />
        <div className="absolute -bottom-24 left-10 w-[500px] h-[500px] rounded-full bg-secondary/20 blur-3xl" />
      </div>

      {/* Scenic Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsE2TnWqEWnpcBZjm47Jyr1IBpT0MlirhrMdb24SNVhEzN4E9c46NWER4k4RtfXRm_rl_JoGWS0eX1MHpNGrUnoJXA20mtkhOX_NNDYX5-2vhZuYudpwUt_dXywPYMaVJuVakubCeU69lEvOQjcCpiJK-iWCAolydBMTQ4eOZG28TPQowZmt7YosI7qxxMgtGVwBeEJ3kCr37Ofr7a70Ib1fxIV2p7IfCc71SMjlI')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-container/85 via-primary-container/75 to-surface" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-16 lg:pt-36 lg:pb-20 flex flex-col items-center">
        {/* Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md shadow-sm mb-6">
          <span className="material-symbols-outlined material-symbols-filled text-secondary-container text-lg">
            verified
          </span>
          <span className="text-xs font-semibold text-surface-bright tracking-wide uppercase">
            Nền tảng vé xe công nghệ thế hệ mới
          </span>
          <span className="text-outline-variant text-xs">|</span>
          <span className="text-xs font-bold text-secondary-fixed flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
            500+ Nhà xe liên tỉnh uy tín
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold text-center text-surface-bright tracking-tight max-w-5xl leading-[1.08]">
          Đặt vé xe khách liên tỉnh chất lượng cao
          <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-secondary-fixed via-secondary-container to-secondary-fixed-dim">
            Hành trình êm ái, trọn vẹn từng khoảnh khắc
          </span>
        </h1>

        <p className="text-sm sm:text-base lg:text-lg text-surface-dim text-center max-w-3xl mt-5 leading-relaxed">
          Khóa ghế giữ chỗ 10 phút chống trùng lặp • Vé điện tử QR gửi tự động qua
          Email • Thanh toán tức thì qua VietQR (SePay) & Ví MoMo
        </p>

        {/* CENTRAL BOOKING SEARCH BOX */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full mt-8 bg-surface-container-lowest text-on-surface rounded-2xl shadow-xl p-5 sm:p-6 lg:p-7 border border-outline-variant/20"
        >
          {/* Mode Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-surface-container">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-container text-on-primary text-sm font-semibold shadow-sm">
              <span className="material-symbols-outlined text-base text-secondary-container">
                arrow_forward
              </span>
              <span>Đặt vé một chiều</span>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-on-surface-variant">
              <span className="inline-flex items-center gap-1 text-secondary">
                <span className="material-symbols-outlined text-base">bolt</span>
                Giữ chỗ 10 phút khi thanh toán
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-base">
                  airline_seat_recline_extra
                </span>
                Sơ đồ ghế 22 / 36 / 45 chỗ trực quan
              </span>
            </div>
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-center pt-4">
            {/* Origin Select */}
            <div className="lg:col-span-3 relative">
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Điểm đi
              </label>
              <div className="min-h-[68px] flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface-container-low focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-secondary-container transition-all">
                <span className="material-symbols-outlined text-secondary-container shrink-0">
                  radio_button_checked
                </span>
                <div className="flex-1 min-w-0">
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-transparent font-display text-[15px] sm:text-base font-bold text-on-surface focus:outline-none truncate cursor-pointer"
                  >
                    {locations.map((loc) => (
                      <option key={`orig-${loc.id}`} value={loc.province_name}>
                        {loc.province_name}
                      </option>
                    ))}
                  </select>
                  <span className="block text-[11px] sm:text-xs text-on-surface-variant truncate">
                    {originStationNote}
                  </span>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="lg:col-span-1 flex justify-center -my-1 lg:my-0 lg:pt-5">
              <button
                type="button"
                onClick={handleSwapRoute}
                aria-label="Đổi điểm đi và điểm đến"
                className="w-10 h-10 rounded-full bg-surface-container hover:bg-secondary-fixed transition-colors active:scale-95 flex items-center justify-center text-primary-container shadow-sm cursor-pointer"
              >
                <span
                  className="material-symbols-outlined text-xl transition-transform duration-300"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  swap_horiz
                </span>
              </button>
            </div>

            {/* Destination Select */}
            <div className="lg:col-span-3 relative">
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Điểm đến
              </label>
              <div className="min-h-[68px] flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface-container-low focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-secondary-container transition-all">
                <span className="material-symbols-outlined text-error shrink-0">
                  location_on
                </span>
                <div className="flex-1 min-w-0">
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-transparent font-display text-[15px] sm:text-base font-bold text-on-surface focus:outline-none truncate cursor-pointer"
                  >
                    {locations.map((loc) => (
                      <option key={`dest-${loc.id}`} value={loc.province_name}>
                        {loc.province_name}
                      </option>
                    ))}
                  </select>
                  <span className="block text-[11px] sm:text-xs text-on-surface-variant truncate">
                    {destStationNote}
                  </span>
                </div>
              </div>
            </div>

            {/* Departure Date */}
            <div className="lg:col-span-3">
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Ngày đi
              </label>
              <div className="min-h-[68px] flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface-container-low focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-secondary-container transition-all">
                <span className="material-symbols-outlined text-secondary shrink-0">
                  calendar_today
                </span>
                <div className="flex-1 min-w-0">
                  <input
                    type="date"
                    min={todayIso}
                    value={departureDate}
                    onChange={(e) => {
                      setDepartureDate(e.target.value);
                      setActivePreset("");
                    }}
                    className="w-full bg-transparent font-display text-[15px] sm:text-base font-bold text-on-surface focus:outline-none cursor-pointer"
                  />
                  <span className="block text-xs text-secondary font-medium">
                    Mở bán vé trực tuyến
                  </span>
                </div>
              </div>
            </div>

            {/* Seat Count */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Số lượng ghế
              </label>
              <div className="min-h-[68px] flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface-container-low">
                <span className="material-symbols-outlined text-on-surface-variant shrink-0">
                  group
                </span>
                <div className="flex-1 min-w-0">
                  <select
                    value={seatCount}
                    onChange={(e) => setSeatCount(Number(e.target.value))}
                    className="w-full bg-transparent font-display text-[15px] sm:text-base font-bold text-on-surface focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} Hành khách
                      </option>
                    ))}
                  </select>
                  <span className="block text-xs text-on-surface-variant truncate">
                    Ghế đơn / Cabin
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Date Fast-Picks & Submit CTA */}
          <div className="mt-5 pt-3 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
              <span className="text-xs font-bold text-on-surface-variant mr-1">
                Chọn nhanh:
              </span>
              {[
                { key: "today", label: "Hôm nay" },
                { key: "tomorrow", label: "Ngày mai" },
                { key: "saturday", label: "Thứ 7 tới" },
                { key: "sunday", label: "Chủ nhật tới" },
              ].map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() =>
                    handleQuickDateSelect(
                      chip.key as "today" | "tomorrow" | "saturday" | "sunday"
                    )
                  }
                  className={`px-3.5 py-2 rounded-full text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer ${
                    activePreset === chip.key
                      ? "bg-surface-container text-on-surface shadow-xs"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="w-full md:w-auto min-w-[230px] min-h-[52px] px-8 py-3 rounded-xl bg-secondary-container hover:bg-secondary hover:text-white text-primary-container font-display text-[15px] sm:text-base font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">
                search
              </span>
              <span>TÌM CHUYẾN XE</span>
            </button>
          </div>
        </form>

        {/* Quick Trust Badges Strip */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 text-surface-bright">
          {[
            { icon: "event_seat", text: "Cam kết giữ đúng 100% số ghế" },
            { icon: "timer", text: "Khóa ghế tạm thời 10 phút" },
            { icon: "verified_user", text: "Thanh toán VietQR & Ví MoMo" },
            { icon: "qr_code_2", text: "Vé điện tử QR gửi qua Email" },
          ].map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 backdrop-blur-sm"
            >
              <div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary-container text-lg">
                  {badge.icon}
                </span>
              </div>
              <span className="text-xs font-semibold text-surface-bright">
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}