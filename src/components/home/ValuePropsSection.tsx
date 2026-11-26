// src/components/home/ValuePropsSection.tsx
import React from "react";

const VALUE_PROPS = [
  {
    icon: "airline_seat_recline_extra",
    title: "Sơ đồ ghế trực quan chuẩn xác",
    description:
      "Hỗ trợ đầy đủ các dòng xe Limousine 22 phòng, Giường nằm 36 chỗ và Ghế ngồi 45 chỗ. Chọn đúng vị trí tầng trên/tầng dưới theo thời gian thực.",
  },
  {
    icon: "timer",
    title: "Khóa ghế giữ chỗ 10 phút",
    description:
      "Cơ chế Concurrency Seat Locking tự động khóa ghế ngay khi bạn bấm thanh toán, loại bỏ hoàn toàn tình trạng 2 người đặt trùng 1 chỗ.",
  },
  {
    icon: "qr_code_2",
    title: "Vé điện tử QR thông minh",
    description:
      "Hệ thống tự động xuất vé kèm mã QR gửi thẳng về Email sau khi thanh toán. Nhân viên nhà xe quét QR Check-in lên xe không cần in giấy.",
  },
  {
    icon: "lock",
    title: "Thanh toán tự động 24/7",
    description:
      "Tích hợp cổng thanh toán MoMo và mã VietQR động (qua SePay) tự động nhận diện giao dịch và kích hoạt vé chỉ sau vài giây.",
  },
];

const BOOKING_STEPS = [
  {
    step: 1,
    title: "Tìm chuyến phù hợp",
    description:
      "Nhập điểm đi, điểm đến và ngày khởi hành để so sánh các chuyến xe mở bán với bảng giá minh bạch.",
    badgeIcon: "search",
    badgeText: "Lọc theo giờ & loại xe",
    highlight: true,
  },
  {
    step: 2,
    title: "Chọn ghế & Điểm đón/trả",
    description:
      "Xem sơ đồ ghế trực tiếp của chuyến xe, chọn ghế trống và điểm đón/trả chi tiết theo lộ trình.",
    badgeIcon: "airline_seat_recline_normal",
    badgeText: "Khóa chỗ trong 10 phút",
    highlight: false,
  },
  {
    step: 3,
    title: "Thanh toán VietQR / MoMo",
    description:
      "Quét mã VietQR chuyển khoản chính xác hoặc thanh toán qua Ví MoMo. Webhook tự động xác nhận đơn.",
    badgeIcon: "qr_code_scanner",
    badgeText: "Xác nhận tức thì",
    highlight: false,
  },
  {
    step: 4,
    title: "Nhận vé QR & Lên xe",
    description:
      "Nhận vé điện tử qua Email hoặc quản lý trong mục 'Vé của tôi', xuất trình mã QR để nhà xe soát vé.",
    badgeIcon: "task_alt",
    badgeText: "Check-in QR 1 chạm",
    highlight: true,
  },
];

export default function ValuePropsSection() {
  return (
    <>
      {/* WHY CHOOSE VIVUCOACH */}
      <section className="w-full bg-primary-container text-on-primary py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs text-secondary-container uppercase font-bold tracking-wider">
              Trải nghiệm vượt trội
            </span>
            <h2 className="font-display text-3xl lg:text-[2.25rem] font-bold text-on-primary mt-1 leading-tight">
              Sự khác biệt khi đặt vé trên ViVuCoach
            </h2>
            <p className="text-sm text-on-primary-container mt-2">
              Ứng dụng công nghệ quản trị chỗ ngồi thời gian thực, loại bỏ hoàn
              toàn tình trạng trùng ghế hay chờ đợi tại bến.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUE_PROPS.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors border border-white/10"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary-container mb-4">
                  <span className="material-symbols-outlined text-2xl">
                    {item.icon}
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-on-primary">
                  {item.title}
                </h3>
                <p className="text-[13px] text-on-primary-container mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-STEP HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-14 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs text-secondary uppercase font-bold tracking-wider">
            Thao tác đơn giản
          </span>
          <h2 className="font-display text-3xl lg:text-[2.25rem] font-bold text-on-surface mt-1 leading-tight">
            Đặt vé thông minh chỉ trong 4 bước
          </h2>
          <p className="text-sm text-on-surface-variant mt-2">
            Toàn bộ quy trình diễn ra trơn tru trong chưa đầy 60 giây trên máy
            tính hoặc thiết bị di động.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BOOKING_STEPS.map((item) => (
            <div
              key={item.step}
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs flex flex-col justify-between border border-outline-variant/25"
            >
              <div>
                <div
                  className={`w-10 h-10 rounded-full font-display text-lg font-black flex items-center justify-center mb-4 shadow-xs ${
                    item.highlight
                      ? "bg-secondary-container text-primary-container"
                      : "bg-surface-container text-primary-container"
                  }`}
                >
                  {item.step}
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-on-surface">
                  {item.title}
                </h3>
                <p className="text-[13px] text-on-surface-variant mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-surface-container flex items-center gap-2 text-secondary text-xs font-bold">
                <span className="material-symbols-outlined text-base">
                  {item.badgeIcon}
                </span>
                <span>{item.badgeText}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}