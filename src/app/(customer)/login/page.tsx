// src/app/(customer)/login/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneOrEmail, setPhoneOrEmail] = useState("0912345678");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [noticeMessage, setNoticeMessage] = useState(() =>
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("redirect")
      ? "Vui lòng đăng nhập để bắt đầu đặt vé."
      : ""
  );

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const supabase = createClient();
      const redirect = new URLSearchParams(window.location.search).get("redirect");
      const callbackUrl = new URL("/api/auth/callback", window.location.origin);
      if (redirect) callbackUrl.searchParams.set("redirect", redirect);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callbackUrl.toString() },
      });
      if (error) throw error;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể đăng nhập bằng Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      if (authMode === "register") {
        if (method !== "email") {
          setErrorMessage("Vui lòng chọn phương thức đăng ký bằng Email.");
          return;
        }
        if (!fullName.trim()) {
          setErrorMessage("Vui lòng nhập họ tên.");
          return;
        }
        if (password.length < 8) {
          setErrorMessage("Mật khẩu đăng ký phải có ít nhất 8 ký tự.");
          return;
        }

        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
          email: phoneOrEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              role: "USER",
            },
          },
        });
        if (error) throw error;

        if (data.session) {
          setNoticeMessage("Đăng ký thành công. Đang vào trang người dùng...");
          router.push("/");
          router.refresh();
        } else {
          setNoticeMessage(
            "Đăng ký thành công. Vui lòng kiểm tra Email để xác nhận tài khoản."
          );
        }
        return;
      }

      if (method !== "email") {
        setErrorMessage("Tài khoản demo hiện hỗ trợ đăng nhập bằng Email.");
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: phoneOrEmail,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profile?.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (profile?.role === "OPERATOR") {
          router.push("/operator/trips");
        } else {
          const redirect = new URLSearchParams(window.location.search).get("redirect");
          router.push(redirect || "/");
        }
        router.refresh();
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể đăng nhập. Vui lòng kiểm tra lại thông tin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-surface py-10 px-6 lg:px-12 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/25 bg-surface-container-lowest">
        {/* Cột Trái: Brand & Quyền lợi ViVuClub */}
        <div className="lg:col-span-5 bg-primary-container text-on-primary p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-secondary-container text-xs font-bold uppercase tracking-wider mb-6">
              <span className="material-symbols-outlined text-base">stars</span>
              <span>Thành viên ViVuClub</span>
            </div>
            <h1 className="font-display text-2xl lg:text-3xl font-extrabold leading-tight">
              Một tài khoản cho mọi hành trình liên tỉnh
            </h1>
            <p className="text-sm text-on-primary-container mt-3 leading-relaxed">
              Đăng nhập bằng Google để hệ thống tự động liên kết toàn bộ vé điện tử bạn từng đặt bằng Email ở chế độ khách (Guest).
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  icon: "sync_saved_locally",
                  title: "Tự động đồng bộ vé qua Gmail",
                  desc: "Tra cứu, quản lý và hủy vé hợp lệ trước 24h khởi hành ngay trên Web.",
                },
                {
                  icon: "bolt",
                  title: "Đặt vé 1 chạm (Auto-fill)",
                  desc: "Tự động điền Họ tên, SĐT và Email nhận mã QR ở bước thanh toán.",
                },
                {
                  icon: "verified_user",
                  title: "Bảo mật chuẩn OAuth 2.0",
                  desc: "Quản lý phiên đăng nhập an toàn qua HttpOnly Session Cookie.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary-container shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-lg">
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-on-primary">
                      {item.title}
                    </h3>
                    <p className="text-xs text-on-primary-container mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-on-primary-container">
            <span>Phân quyền tự động RBAC:</span>
            <div className="flex gap-2">
              <Link
                href="/operator/trips"
                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-on-primary font-semibold"
              >
                Demo Nhà Xe
              </Link>
              <Link
                href="/admin/dashboard"
                className="px-2.5 py-1 rounded bg-secondary-container/20 hover:bg-secondary-container/30 text-secondary-container font-semibold"
              >
                Demo Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Cột Phải: Form Đăng nhập / Đăng ký */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Chuyển Tab Đăng nhập / Đăng ký */}
            {noticeMessage && (
              <div className="mb-4 rounded-xl border border-secondary-container/40 bg-secondary-fixed/30 px-4 py-3 text-xs font-bold text-on-secondary-fixed">
                {noticeMessage}
              </div>
            )}

            <div className="grid grid-cols-2 p-1 bg-surface-container-low rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`py-2.5 rounded-lg font-display text-sm font-bold transition-all cursor-pointer ${
                  authMode === "login"
                    ? "bg-surface-container-lowest text-primary-container shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className={`py-2.5 rounded-lg font-display text-sm font-bold transition-all cursor-pointer ${
                  authMode === "register"
                    ? "bg-surface-container-lowest text-primary-container shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Đăng ký thành viên
              </button>
            </div>

            {/* Nút Google OAuth 2.0 Trọng tâm */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-primary-container hover:bg-[#1e3e62] text-on-primary font-display text-sm font-bold shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer"
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
              <span>Tiếp tục nhanh với Google (Khuyên dùng)</span>
            </button>

            <div className="relative my-6 flex items-center justify-center">
              <div className="border-t border-outline-variant/40 w-full" />
              <span className="bg-surface-container-lowest px-3 text-xs text-on-surface-variant whitespace-nowrap">
                hoặc dùng Số điện thoại / Email
              </span>
              <div className="border-t border-outline-variant/40 w-full" />
            </div>

            {/* Chuyển phương thức SĐT / Email */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => {
                  setMethod("phone");
                  setPhoneOrEmail("0912345678");
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  method === "phone"
                    ? "border-secondary-container bg-secondary-fixed/40 text-on-secondary-fixed"
                    : "border-outline-variant/40 text-on-surface-variant"
                }`}
              >
                Số điện thoại
              </button>
              <button
                type="button"
                onClick={() => {
                  setMethod("email");
                  setPhoneOrEmail("admin@vivucoach.vn");
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  method === "email"
                    ? "border-secondary-container bg-secondary-fixed/40 text-on-secondary-fixed"
                    : "border-outline-variant/40 text-on-surface-variant"
                }`}
              >
                Địa chỉ Email
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="rounded-xl border border-error/30 bg-error-container px-4 py-3 text-xs font-semibold text-on-error-container">
                  {errorMessage}
                </div>
              )}

              {authMode === "register" && (
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Họ và tên hành khách
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn An"
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface-container-low focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary-container text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  {method === "phone" ? "Số điện thoại di động" : "Email tài khoản"}
                </label>
                <div className="flex gap-2">
                  <input
                    type={method === "phone" ? "tel" : "email"}
                    required
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder={
                      method === "phone" ? "0912 345 678" : "ban@gmail.com"
                    }
                    className="flex-1 px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface-container-low focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary-container text-sm"
                  />
                  {method === "phone" && (
                    <button
                      type="button"
                      onClick={() => setOtpSent(true)}
                      className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-secondary-fixed text-xs font-bold text-primary-container shrink-0 cursor-pointer"
                    >
                      {otpSent ? "Đã gửi OTP" : "Gửi mã OTP"}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  {method === "phone" && otpSent ? "Mã xác thực OTP (6 số)" : "Mật khẩu"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface-container-low focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary-container text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-secondary-container hover:bg-secondary hover:text-white text-primary-container font-display text-sm font-extrabold shadow-md transition-all cursor-pointer"
              >
                {loading
                  ? "Đang xử lý..."
                  : authMode === "login"
                  ? "ĐĂNG NHẬP HỆ THỐNG"
                  : "TẠO TÀI KHOẢN VIVUCLUB"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}