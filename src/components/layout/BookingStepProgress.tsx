// src/components/layout/BookingStepProgress.tsx
import React from "react";

interface BookingStepProgressProps {
  currentStep: 1 | 2 | 3 | 4;
}

const STEPS = [
  { step: 1, label: "1. Chọn chuyến xe" },
  { step: 2, label: "2. Chọn chỗ & Tiện ích" },
  { step: 3, label: "3. Thông tin & Thanh toán" },
  { step: 4, label: "4. Hoàn tất & Vé điện tử" },
];

export default function BookingStepProgress({ currentStep }: BookingStepProgressProps) {
  return (
    <div className="w-full bg-surface-container-lowest border-b border-surface-container-high shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-6 min-w-max mx-auto text-xs font-semibold">
          {STEPS.map((item, idx) => {
            const isCompleted = item.step < currentStep;
            const isCurrent = item.step === currentStep;

            return (
              <React.Fragment key={item.step}>
                <div
                  className={`flex items-center gap-2 ${
                    isCurrent
                      ? "text-on-surface font-bold"
                      : isCompleted
                      ? "text-secondary font-semibold"
                      : "text-on-surface-variant"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      isCurrent
                        ? "bg-primary-container text-on-primary"
                        : isCompleted
                        ? "bg-secondary-container text-primary-container font-bold"
                        : "bg-surface-container-high text-on-surface"
                    }`}
                  >
                    {isCompleted ? "✓" : item.step}
                  </span>
                  <span>{item.label}</span>
                </div>

                {idx < STEPS.length - 1 && (
                  <span
                    className={`w-8 h-0.5 ${
                      item.step < currentStep
                        ? "bg-secondary-container"
                        : "bg-surface-container-high"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}