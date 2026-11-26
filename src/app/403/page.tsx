import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="min-h-[70vh] px-6 flex items-center justify-center">
      <section className="max-w-md text-center rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-lg">
        <span className="material-symbols-outlined text-5xl text-error">
          lock
        </span>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-on-surface">
          Không có quyền truy cập
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Trang này chỉ dành cho tài khoản quản trị hoặc nhà xe có vai trò phù hợp.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex px-5 py-3 rounded-xl bg-primary-container text-on-primary text-sm font-bold"
        >
          Về trang chủ
        </Link>
      </section>
    </main>
  );
}
