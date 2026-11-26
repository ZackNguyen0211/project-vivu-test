// src/components/home/VerifiedOperatorsSection.tsx
import React from "react";
import { OperatorSummary } from "@/types/home";

interface VerifiedOperatorsSectionProps {
  operators: OperatorSummary[];
}

export default function VerifiedOperatorsSection({
  operators,
}: VerifiedOperatorsSectionProps) {
  return (
    <section
      id="operators"
      className="max-w-7xl mx-auto px-6 lg:px-12 py-14 w-full"
    >
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-surface-container text-on-surface text-xs font-bold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-base text-secondary">
            verified
          </span>
          <span>Hệ sinh thái vận tải hàng đầu</span>
        </div>
        <h2 className="font-display text-3xl lg:text-[2.25rem] font-bold text-on-surface leading-tight">
          Đồng hành cùng các nhà xe uy tín số 1 Việt Nam
        </h2>
        <p className="text-sm text-on-surface-variant mt-2">
          Các đối tác nhà xe trên ViVuCoach đều được kiểm duyệt phương tiện, sơ đồ
          ghế chuẩn xác và cam kết không bắt khách dọc đường.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {operators.map((op, index) => (
          <div
            key={op.id}
            className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between border border-outline-variant/25"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-display text-xl font-black ${
                    index % 2 === 0
                      ? "bg-secondary-fixed text-secondary"
                      : "bg-surface-container text-primary-container"
                  }`}
                >
                  {op.short_code}
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-xs font-bold">
                  <span className="material-symbols-outlined material-symbols-filled text-sm text-secondary-container">
                    star
                  </span>
                  {op.rating} ({op.review_count_label})
                </span>
              </div>

              <h3 className="font-display text-lg sm:text-xl font-bold text-on-surface">
                {op.name}
              </h3>
              <p className="text-[13px] text-on-surface-variant mt-1.5 leading-relaxed">
                {op.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-surface-container flex items-center justify-between text-secondary text-xs font-bold">
              <span>{op.fleet_highlight}</span>
              <span className="material-symbols-outlined text-base">
                verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}