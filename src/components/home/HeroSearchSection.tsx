// src/components/home/HeroSearchSection.tsx
"use client";

import React, { useState, useMemo, useEffect, useId, useRef } from "react";
import { useRouter } from "next/navigation";
import { LocationItem } from "@/types/home";

interface HeroSearchSectionProps {
  locations: LocationItem[];
}

interface SearchDropdownOption {
  value: string;
  label: string;
  description?: string;
}

interface SearchDropdownProps {
  label: string;
  icon: string;
  iconClassName: string;
  value: string;
  description: string;
  options: SearchDropdownOption[];
  onChange: (value: string) => void;
}

function parseIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return year && month && day
    ? new Date(year, month - 1, day)
    : new Date(2000, 0, 1);
}

function formatIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface DatePickerProps {
  value: string;
  minDate: string;
  onChange: (value: string) => void;
}

function DatePicker({ value, minDate, onChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [calendarMaxHeight, setCalendarMaxHeight] = useState<number>();
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const initialDate = parseIsoDate(value || minDate);
    return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedDate = value ? parseIsoDate(value) : null;
  const monthLabel = new Intl.DateTimeFormat("vi-VN", {
    month: "long",
    year: "numeric",
  }).format(visibleMonth);
  const selectedLabel = selectedDate
    ? new Intl.DateTimeFormat("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(selectedDate)
    : "Chọn ngày khởi hành";
  const selectedWeekday = selectedDate
    ? new Intl.DateTimeFormat("vi-VN", { weekday: "long" }).format(selectedDate)
    : "Mở bán vé trực tuyến";

  const firstDayOffset = (visibleMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0
  ).getDate();
  const cellCount = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7;
  const calendarDays = Array.from({ length: cellCount }, (_, index) => {
    const day = index - firstDayOffset + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const openCalendar = () => {
    const dateToShow = parseIsoDate(value || minDate);
    const pickerBounds = rootRef.current?.getBoundingClientRect();
    if (pickerBounds) {
      const spaceAbove = pickerBounds.top - 8;
      const spaceBelow = window.innerHeight - pickerBounds.bottom - 8;
      const shouldOpenUp = spaceBelow < 320 && spaceAbove > spaceBelow;
      setOpenUp(shouldOpenUp);
      setCalendarMaxHeight(Math.max(160, shouldOpenUp ? spaceAbove : spaceBelow));
    }
    setVisibleMonth(new Date(dateToShow.getFullYear(), dateToShow.getMonth(), 1));
    setIsOpen((open) => !open);
  };

  const moveMonth = (amount: number) => {
    setVisibleMonth(
      (month) => new Date(month.getFullYear(), month.getMonth() + amount, 1)
    );
  };

  const selectDay = (day: number) => {
    const selected = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      day
    );
    onChange(formatIsoDate(selected));
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div
      ref={rootRef}
      className={`relative ${isOpen ? "z-30" : ""}`}
      onKeyDown={handleKeyDown}
    >
      <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
        Ngày đi
      </label>
      <div
        className={`min-h-[68px] flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface-container-low transition-all ${
          isOpen
            ? "bg-surface-container-lowest ring-2 ring-secondary-container"
            : "focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-secondary-container"
        }`}
      >
        <span className="material-symbols-outlined text-secondary shrink-0">
          calendar_today
        </span>
        <button
          ref={triggerRef}
          type="button"
          aria-label={`Ngày đi: ${selectedLabel}`}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={openCalendar}
          className="flex flex-1 min-w-0 items-center justify-between gap-2 text-left focus:outline-none"
        >
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-display text-[15px] sm:text-base font-bold text-on-surface">
              {selectedLabel}
            </span>
            <span className="block truncate text-[11px] sm:text-xs text-secondary font-medium">
              {selectedWeekday}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={`material-symbols-outlined shrink-0 text-lg text-on-surface-variant transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </button>
      </div>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Chọn ngày đi"
          style={{ maxHeight: calendarMaxHeight }}
          className={`dropdown-enter absolute inset-x-0 z-50 w-72 max-w-[calc(100vw-3rem)] overflow-y-auto rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-2 shadow-xl sm:left-0 sm:right-auto ${
            openUp ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              aria-label="Tháng trước"
              onClick={() => moveMonth(-1)}
              disabled={
                Boolean(minDate) &&
                formatIsoDate(
                  new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 0)
                ) < minDate
              }
              className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>
            <span className="font-display text-sm font-bold text-on-surface">
              {monthLabel}
            </span>
            <button
              type="button"
              aria-label="Tháng sau"
              onClick={() => moveMonth(1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </div>

          <div
            role="grid"
            aria-label={monthLabel}
            className="grid grid-cols-7 gap-x-0.5 gap-y-0 text-center"
          >
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((weekday) => (
              <span
                key={weekday}
                role="columnheader"
                className="py-1 text-[10px] font-bold uppercase text-on-surface-variant"
              >
                {weekday}
              </span>
            ))}
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <span key={`empty-${index}`} role="gridcell" />;
              }

              const date = new Date(
                visibleMonth.getFullYear(),
                visibleMonth.getMonth(),
                day
              );
              const isoDate = formatIsoDate(date);
              const isSelected = isoDate === value;
              const isDisabled = Boolean(minDate && isoDate < minDate);

              return (
                <span key={isoDate} role="gridcell">
                  <button
                    type="button"
                    aria-label={new Intl.DateTimeFormat("vi-VN", {
                      dateStyle: "full",
                    }).format(date)}
                    aria-pressed={isSelected}
                    disabled={isDisabled}
                    onClick={() => selectDay(day)}
                    className={`h-8 w-8 rounded-full text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container disabled:cursor-not-allowed disabled:opacity-30 ${
                      isSelected
                        ? "bg-primary-container text-on-primary"
                        : "text-on-surface hover:bg-surface-container-low"
                    }`}
                  >
                    {day}
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchDropdown({
  label,
  icon,
  iconClassName,
  value,
  description,
  options,
  onChange,
}: SearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const focusOption = (index: number) => {
    const optionButtons =
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]');
    optionButtons?.[index]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (event.target === triggerRef.current) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setIsOpen(true);
        window.requestAnimationFrame(() => {
          focusOption(event.key === "ArrowDown" ? 0 : options.length - 1);
        });
      }
      return;
    }

    if ((event.target as HTMLElement).getAttribute("role") !== "option") return;

    const optionButtons = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? []
    );
    const currentIndex = optionButtons.indexOf(event.target as HTMLButtonElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      focusOption(
        (currentIndex + direction + optionButtons.length) % optionButtons.length
      );
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      focusOption(event.key === "Home" ? 0 : optionButtons.length - 1);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`relative ${isOpen ? "z-30" : ""}`}
      onKeyDown={handleKeyDown}
    >
      <span className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
        {label}
      </span>
      <div
        className={`min-h-[68px] flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface-container-low transition-all ${
          isOpen
            ? "bg-surface-container-lowest ring-2 ring-secondary-container"
            : "focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-secondary-container"
        }`}
      >
        <span className={`material-symbols-outlined shrink-0 ${iconClassName}`}>
          {icon}
        </span>
        <button
          ref={triggerRef}
          type="button"
          aria-label={`${label}: ${selectedOption?.label ?? value}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${id}-listbox`}
          disabled={options.length === 0}
          onClick={() => setIsOpen((open) => !open)}
          className="flex flex-1 min-w-0 items-center justify-between gap-2 text-left focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-display text-[15px] sm:text-base font-bold text-on-surface">
              {selectedOption?.label ?? value}
            </span>
            <span className="block truncate text-[11px] sm:text-xs text-on-surface-variant">
              {description}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={`material-symbols-outlined shrink-0 text-lg text-on-surface-variant transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </button>
      </div>

      {isOpen && (
        <div
          ref={listRef}
          id={`${id}-listbox`}
          role="listbox"
          aria-label={label}
          className="dropdown-enter absolute inset-x-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-1.5 shadow-xl"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors focus:bg-surface-container-low focus:outline-none ${
                  isSelected
                    ? "bg-surface-container-low text-primary-container"
                    : "text-on-surface hover:bg-surface-container-low"
                }`}
              >
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-semibold">
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="truncate text-xs text-on-surface-variant">
                      {option.description}
                    </span>
                  )}
                </span>
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-base text-secondary"
                  >
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function HeroSearchSection({ locations }: HeroSearchSectionProps) {
  const router = useRouter();
  const defaultOrigin = locations[0]?.province_name || "TP. Hồ Chí Minh";
  const defaultDestination =
    locations.find((location) => location.province_name !== defaultOrigin)
      ?.province_name || defaultOrigin;

  // 1. Khởi tạo rỗng để tránh gọi new Date() khi Next.js prerender trên server
  const [todayIso, setTodayIso] = useState<string>("");
  const [departureDate, setDepartureDate] = useState<string>("");

  const [origin, setOrigin] = useState<string>(defaultOrigin);
  const [destination, setDestination] = useState<string>(defaultDestination);
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

  const locationOptions = useMemo(() => {
    const seenProvinces = new Set<string>();
    return locations
      .filter((location) => {
        if (seenProvinces.has(location.province_name)) return false;
        seenProvinces.add(location.province_name);
        return true;
      })
      .map((location) => ({
        value: location.province_name,
        label: location.province_name,
        description: location.station_name,
      }));
  }, [locations]);

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
            <div className="lg:col-span-3">
              <SearchDropdown
                label="Điểm đi"
                icon="radio_button_checked"
                iconClassName="text-secondary-container"
                value={origin}
                description={originStationNote}
                options={locationOptions}
                onChange={setOrigin}
              />
            </div>

            {/* Swap Button */}
            <div className="lg:col-span-1 flex justify-center -my-1 lg:my-0 lg:pt-5">
              <button
                type="button"
                onClick={handleSwapRoute}
                aria-label="Đổi điểm đi và điểm đến"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-primary-container shadow-sm transition-all duration-200 hover:scale-105 hover:bg-secondary-fixed active:scale-90 motion-reduce:transition-none"
              >
                <span
                  className="material-symbols-outlined text-xl transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  swap_horiz
                </span>
              </button>
            </div>

            {/* Destination Select */}
            <div className="lg:col-span-3">
              <SearchDropdown
                label="Điểm đến"
                icon="location_on"
                iconClassName="text-error"
                value={destination}
                description={destStationNote}
                options={locationOptions}
                onChange={setDestination}
              />
            </div>

            {/* Departure Date */}
            <div className="lg:col-span-3">
              <DatePicker
                value={departureDate}
                minDate={todayIso}
                onChange={(date) => {
                  setDepartureDate(date);
                  setActivePreset("");
                }}
              />
            </div>

            {/* Seat Count */}
            <div className="lg:col-span-2">
              <SearchDropdown
                label="Số lượng ghế"
                icon="group"
                iconClassName="text-on-surface-variant"
                value={String(seatCount)}
                description="Ghế đơn / Cabin"
                options={[1, 2, 3, 4, 5].map((count) => ({
                  value: String(count),
                  label: `${count} Hành khách`,
                }))}
                onChange={(value) => setSeatCount(Number(value))}
              />
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