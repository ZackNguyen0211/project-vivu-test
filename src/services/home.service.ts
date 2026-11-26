// src/services/home.service.ts
import {
  LocationItem,
  OperatorSummary,
  PopularRouteItem,
  TestimonialItem,
  VoucherItem,
} from "@/types/home";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * PLACEHOLDER 1: Lấy danh sách Tỉnh/Thành phố & Bến xe chuẩn từ bảng `locations`
 * Khi nối Supabase:
 * const { data } = await supabase.from('locations').select('*').order('province_name');
 */
export async function getActiveLocations(): Promise<LocationItem[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("locations")
      .select("id, province_name, station_name, address, type")
      .order("province_name");

    if (error) console.error("Supabase locations unavailable:", error.message);
    if (data) return data as LocationItem[];
  }

  return [
    {
      id: "loc-hcm-1",
      province_name: "TP. Hồ Chí Minh",
      station_name: "BX Miền Đông mới / Miền Tây / VP",
      address: "TP. Thủ Đức & Các quận trung tâm",
      type: "BOTH",
    },
    {
      id: "loc-dl-1",
      province_name: "Đà Lạt (Lâm Đồng)",
      station_name: "Bến xe Liên tỉnh Đà Lạt",
      address: "01 Tô Hiến Thành, Phường 3, Đà Lạt",
      type: "BOTH",
    },
    {
      id: "loc-pt-1",
      province_name: "Phan Thiết (Bình Thuận)",
      station_name: "Bến xe Bắc Phan Thiết / Mũi Né",
      address: "Nguyễn Đình Chiểu, Hàm Tiến",
      type: "BOTH",
    },
    {
      id: "loc-nt-1",
      province_name: "Nha Trang (Khánh Hòa)",
      station_name: "Bến xe Phía Nam Nha Trang",
      address: "Km6 Đường 23/10, Vĩnh Trung",
      type: "BOTH",
    },
    {
      id: "loc-vt-1",
      province_name: "Vũng Tàu (BR-VT)",
      station_name: "Bến xe Vũng Tàu",
      address: "Nam Kỳ Khởi Nghĩa, Phường Thắng Tam",
      type: "BOTH",
    },
    {
      id: "loc-hn-1",
      province_name: "Hà Nội",
      station_name: "BX Mỹ Đình / Giáp Bát / Phố Cổ",
      address: "Nội thành Hà Nội",
      type: "BOTH",
    },
    {
      id: "loc-sp-1",
      province_name: "Sa Pa (Lào Cai)",
      station_name: "Bến xe Trung tâm Sa Pa",
      address: "Quốc lộ 4D, Thị xã Sa Pa",
      type: "BOTH",
    },
    {
      id: "loc-hg-1",
      province_name: "Hà Giang",
      station_name: "Bến xe Khách Hà Giang",
      address: "Đường 19/5, Phường Nguyễn Trãi",
      type: "BOTH",
    },
    {
      id: "loc-dn-1",
      province_name: "Đà Nẵng",
      station_name: "Bến xe Trung tâm Đà Nẵng",
      address: "Tôn Đức Thắng, Liên Chiểu, Đà Nẵng",
      type: "BOTH",
    },
  ];
}

/**
 * PLACEHOLDER 2: Lấy danh sách tuyến đường phổ biến từ bảng `routes` kết hợp `trips`
 * Khi nối Supabase:
 * const { data } = await supabase
 *   .from('routes')
 *   .select('*, operators(name), trips(count)')
 *   .limit(6);
 */
export async function getPopularRoutes(
  departureFilter?: string
): Promise<PopularRouteItem[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    let query = supabase
      .from("routes")
      .select("id, operator_id, departure_province, destination_province, estimated_duration_minutes, highway_note, base_price, daily_trips_count, coach_label, badge_text, is_hot, description, image_url, amenities");

    if (departureFilter && departureFilter !== "ALL") {
      query = query.eq("departure_province", departureFilter);
    }

    const { data, error } = await query.limit(12);
    if (error) console.error("Supabase routes unavailable:", error.message);
    if (data) return data as PopularRouteItem[];
  }

  const routes: PopularRouteItem[] = [
    {
      id: "route-sg-dl",
      departure_province: "TP. Hồ Chí Minh",
      destination_province: "Đà Lạt",
      estimated_duration_minutes: 390,
      highway_note: "Cao tốc Dầu Giây",
      base_price: 290000,
      daily_trips_count: 28,
      coach_label: "Xe Cung Điện 22/36",
      badge_text: "Tuyến Hot Nhất",
      is_hot: true,
      description:
        "Đón trả linh hoạt: Bến xe Miền Đông mới, Hàng Xanh, trung tâm Đà Lạt & hỗ trợ xe trung chuyển miễn phí tận homestay.",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDOg6r6CRpHO8lHlT8LHybfHO__cvI5TeMWRJ672OW9bI0IeXGgfcSinu-2NuhsaMMs7pLNCHoPaogH1rFGw7FwgjvAuDUsHAZW4tylD4hPf0orVlH1Aom0YPQVfR3q-ztUiWBEIfVRSfv4AGHZoT4L0lvl6pbb-RV2miMB2lH0BBvN5NboCMD5G9J_lsHt7D_3zSJ4WbdhvuCoH9d9sNlAJyZg7DUItSvpUsj79og",
      amenities: [
        { icon: "wifi", label: "WiFi tốc độ cao" },
        { icon: "power", label: "Cổng sạc Type-C" },
        { icon: "water_drop", label: "Nước suối & khăn" },
      ],
    },
    {
      id: "route-sg-pt",
      departure_province: "TP. Hồ Chí Minh",
      destination_province: "Phan Thiết / Mũi Né",
      estimated_duration_minutes: 165,
      highway_note: "Cao tốc Dầu Giây - Phan Thiết",
      base_price: 180000,
      daily_trips_count: 34,
      coach_label: "Limousine Massage",
      badge_text: "Cao tốc thông suốt",
      description:
        "Ghế ngả thương gia bọc da bò Ý tích hợp massage đa điểm, đón trả tận resort đường Nguyễn Đình Chiểu.",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAJSOfCFoHvsSEDJqyyMsGivZDwgecFbR0McELY7N31QgIMSsU6BlP9Rr7OKeXHMKTiaAhsLfRVmrlAXkPehYfLv0NXe-RyYauVCj-EOIIqiHA5u6mWsmOAT2Bo_TsjALDwXyNdUfTn0w1kNnkTaXujUIcB8qusGdQYg1G4QzwtH3l7oR1Npkt6tso8zg0bgp-S-C4WXYE56KyqoZWUvSfpDK0BtRZEayj7qvIN6wg",
      amenities: [
        { icon: "airline_seat_recline_extra", label: "Ghế Massage VIP" },
        { icon: "shield", label: "Bảo hiểm trọn gói" },
      ],
    },
    {
      id: "route-sg-nt",
      departure_province: "TP. Hồ Chí Minh",
      destination_province: "Nha Trang",
      estimated_duration_minutes: 435,
      highway_note: "Cao tốc Cam Lâm",
      base_price: 320000,
      daily_trips_count: 22,
      coach_label: "Chuyên Cơ Mặt Đất",
      badge_text: "Cabin 22 Phòng VIP",
      description:
        "Không gian riêng tư tuyệt đối, rèm che kín đáo, nệm lò xo cao cấp chống xóc cho giấc ngủ êm ái xuyên đêm.",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBaVWp6585HOFld1zjdN9Z5wgFdw7z4SVJDe_RQadQY1fdgaSsHFKMR1WjKPrCqi9CuXc-30XU4OiK78xHxCC-bFKUWpwt14vwCrbmJLs502hPHEg9DoHU8NvgeFYbqEbkfOyaBOvbPofzU1nXP8mCvMCBXVtW1Rrpx4ID_X-BvVnd_5DiEM0XujMTiPG4UEb8p2Un5XPG32xtZK558kkEib6uoZleXRTSKlK0lPW4",
      amenities: [
        { icon: "tv", label: "Smart TV giải trí" },
        { icon: "headphones", label: "Tai nghe khử ồn" },
      ],
    },
    {
      id: "route-sg-vt",
      departure_province: "TP. Hồ Chí Minh",
      destination_province: "Vũng Tàu",
      estimated_duration_minutes: 120,
      highway_note: "Cao tốc Long Thành",
      base_price: 160000,
      daily_trips_count: 45,
      coach_label: "Limousine VIP",
      badge_text: "Đón trả tận nhà",
      description:
        "Xe đón trả tận nơi nội thành TP.HCM (Sân bay Tân Sơn Nhất, Quận 1, 3, Bình Thạnh) và mọi điểm tại Vũng Tàu.",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBVp72mEddroGVzQNJ9-EzsaNUW4shgdoPzum8aMBsE4PnTR3b79MjQFNgF0SmFHxQjXT1X7eK5sBxj3_kQz-og1xnLteZmPdkf61oEqNEkHBQtt0Bb5XyZpMVlkeihIc9GC6Fwu4P-IC0-SCwQtq_gbWuIPojyUW2-nNUvbqyh3b0e52_0l96eFRpvDHB0tqQL9vWcxxKqZIllCCpriqCOw_vrlJ882kOfQwVaWRg",
      amenities: [
        { icon: "flight_takeoff", label: "Đón tại Sân Bay" },
        { icon: "schedule", label: "15 phút/chuyến" },
      ],
    },
    {
      id: "route-hn-sp",
      departure_province: "Hà Nội",
      destination_province: "Sa Pa",
      estimated_duration_minutes: 330,
      highway_note: "Cao tốc Nội Bài - Lào Cai",
      base_price: 350000,
      daily_trips_count: 30,
      coach_label: "Cabin Cung Điện",
      badge_text: "Cabin Đôi Tình Yêu",
      description:
        "Không gian phòng riêng kính panorama ngắm đèo Hoàng Liên Sơn hùng vĩ, nhà vệ sinh khép kín chuẩn hàng không.",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuABTAJszY_gAbzoigId_lggiZNqbEL-CS4FviBOyk8pHF3LQLRAXfk7_JmzTQsk-0k5J22oAd9J0WHdygd0fzBbN90D4TUwk0N8ByJKvgWblX-7-ro-jqzkymjtwtEj7r4h9z9D3WRYqbP1-iyIMLuoIhDwnM0p-b62pAIm9E4rYXgnYJyLWUWbhk4psswmCRpqFX_kgQrDPxYdhRrrbCTtbFeWV8LPy_zY0sxD79E",
      amenities: [
        { icon: "wc", label: "Toilet trên xe" },
        { icon: "landscape", label: "Cửa sổ Panorama" },
      ],
    },
    {
      id: "route-hn-hg",
      departure_province: "Hà Nội",
      destination_province: "Hà Giang",
      estimated_duration_minutes: 360,
      highway_note: "Cao tốc Tuyên Quang",
      base_price: 300000,
      daily_trips_count: 18,
      coach_label: "Cung Điện Ánh Sáng",
      badge_text: "Khám Phá Đông Bắc",
      description:
        "Hệ thống giảm xóc khí nén êm ái bậc nhất, đón tại phố cổ Hà Nội và trung chuyển trả tại các điểm thuê xe máy Hà Giang.",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCUKWlAGjJxn2jTkNQpzftHXVJy9QuP8yghp9IcP0vW_blkYNY6QeKF0sCYc61k2Eqlu5ZU7tK9eFPIqacJaJOX-jK5PFqJS0_mUYGYUNs0Q2zF5DdAU1ryI7toYcuu8D_wiRNebKCSxDD8GpkINgq83w6pvB8UEX9D2dnwVCp3-5o9XynC5nwkADdT9LTr6Gvz9WoMGZ2iVcVNVo6a3gXD0yARs4cJdrvbJ4PXUxk",
      amenities: [
        { icon: "two_wheeler", label: "Điểm thuê xe máy" },
        { icon: "hotel", label: "Đón khách sạn" },
      ],
    },
  ];

  if (!departureFilter || departureFilter === "ALL") {
    return routes;
  }

  return routes.filter((r) => r.departure_province === departureFilter);
}

/**
 * PLACEHOLDER 3: Lấy danh sách Nhà xe đối tác đang hoạt động từ bảng `operators`
 * Khi nối Supabase:
 * const { data } = await supabase.from('operators').select('*').eq('status', 'ACTIVE').limit(4);
 */
export async function getFeaturedOperators(): Promise<OperatorSummary[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("operators")
      .select("id, name, code, hotline, description, logo_url, rating, review_count_label, fleet_highlight, status")
      .in("status", ["ACTIVE", "PENDING_APPROVAL"])
      .limit(6);

    if (error) console.error("Supabase operators unavailable:", error.message);
    if (data) {
      return data.map((operator) => ({
        id: operator.id,
        name: operator.name,
        short_code: operator.code?.replace("OP-", "") || operator.name.slice(0, 2).toUpperCase(),
        hotline: operator.hotline || "",
        description: operator.description || "",
        logo_url: operator.logo_url || undefined,
        rating: Number(operator.rating || 0),
        review_count_label: operator.review_count_label || "",
        fleet_highlight: operator.fleet_highlight || "",
        status: operator.status as "ACTIVE" | "INACTIVE",
      }));
    }
  }

  return [
    {
      id: "op-futa",
      name: "Phương Trang (FUTA)",
      short_code: "FT",
      hotline: "19006067",
      description:
        "Mạng lưới bao phủ 63 tỉnh thành, xuất bến đúng giờ, tần suất 15 phút/chuyến.",
      rating: 4.9,
      review_count_label: "120k+",
      fleet_highlight: "Hơn 1.200 xe giường nằm",
      status: "ACTIVE",
    },
    {
      id: "op-thanhbuoi",
      name: "Thành Bưởi Limousine",
      short_code: "TB",
      hotline: "19006079",
      description:
        "Chuyên cơ mặt đất tuyến Sài Gòn - Đà Lạt - Cần Thơ, dịch vụ tiếp viên 5 sao.",
      rating: 4.8,
      review_count_label: "85k+",
      fleet_highlight: "Cabin Cung Điện VIP",
      status: "ACTIVE",
    },
    {
      id: "op-saoviet",
      name: "Sao Việt Express",
      short_code: "SV",
      hotline: "19006746",
      description:
        "Đơn vị dẫn đầu tuyến Hà Nội - Lào Cai - Sa Pa, phòng nằm riêng tư cặp đôi.",
      rating: 4.9,
      review_count_label: "42k+",
      fleet_highlight: "Xe chạy đường cao tốc",
      status: "ACTIVE",
    },
    {
      id: "op-hoamai",
      name: "Hoa Mai Limousine",
      short_code: "HM",
      hotline: "19009227",
      description:
        "Kỷ lục đón trả trung tâm TP.HCM và TP. Vũng Tàu, xuất bến liên tục mỗi 15 phút.",
      rating: 4.8,
      review_count_label: "64k+",
      fleet_highlight: "Limousine đón tận nhà",
      status: "ACTIVE",
    },
  ];
}

/**
 * PLACEHOLDER 4: Lấy danh sách chương trình ưu đãi / Vouchers
 */
export async function getPromotionalVouchers(): Promise<VoucherItem[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("vouchers")
      .select("id, code, badge, icon, title, description, is_vip_club");
    if (error) console.error("Supabase vouchers unavailable:", error.message);
    if (data) return data as VoucherItem[];
  }

  return [
    {
      id: "vc-1",
      code: "VIVUVIETNAM",
      badge: "Khách hàng mới",
      icon: "loyalty",
      title: "Giảm 30.000₫ vé đầu tiên",
      description:
        "Áp dụng cho mọi tuyến xe khi thanh toán chuẩn quét mã VietQR qua cổng SePay.",
    },
    {
      id: "vc-2",
      code: "MOMOVIVU",
      badge: "Ví MoMo 1 chạm",
      icon: "account_balance_wallet",
      title: "Giảm ngay 10% tối đa 50K",
      description:
        "Khuyến mãi tự động hoàn tiền trực tiếp vào tài khoản Ví MoMo liên kết.",
    },
    {
      id: "vc-3",
      code: "DALATWEEKEND",
      badge: "Chuyến đêm VIP",
      icon: "bedtime",
      title: "Giảm 40.000₫ Sài Gòn ⇄ Đà Lạt",
      description:
        "Dành riêng cho dòng xe Limousine 22 Phòng & Giường Nằm 36 chỗ khởi hành tối.",
    },
    {
      id: "vc-4",
      code: "VIVUCLUB",
      badge: "Đặc quyền VIP",
      icon: "stars",
      title: "Đồng bộ vé & Ưu tiên giữ chỗ",
      description:
        "Tự động liên kết lịch sử đặt vé qua Gmail khi đăng nhập tài khoản ViVuClub.",
      is_vip_club: true,
    },
  ];
}

/**
 * PLACEHOLDER 5: Lấy đánh giá thực tế từ khách hàng đã hoàn thành chuyến đi
 */
export async function getCustomerTestimonials(): Promise<TestimonialItem[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, customer_name, initials, route_info, rating, comment");
    if (error) console.error("Supabase testimonials unavailable:", error.message);
    if (data) return data as TestimonialItem[];
  }

  return [
    {
      id: "rev-1",
      customer_name: "Trần Hoàng Long",
      initials: "TH",
      route_info: "Tuyến: Sài Gòn ⇄ Đà Lạt (Limousine 22 phòng)",
      rating: 5,
      comment:
        "Đi công tác gấp lên Đà Lạt, mình đặt vé lúc 22h30 quét mã VietQR là nhận vé QR qua email liền tay. Cabin riêng tư cực êm, có rèm che và cổng sạc nên sáng dậy tới nơi thấy người khỏe khoắn.",
    },
    {
      id: "rev-2",
      customer_name: "Nguyễn Mai Anh",
      initials: "MA",
      route_info: "Tuyến: Sài Gòn ⇄ Phan Thiết Mũi Né",
      rating: 5,
      comment:
        "Cực kỳ hài lòng với chức năng chọn đúng số giường trên sơ đồ ghế trực tiếp. Nhà mình đi có trẻ nhỏ nên cần vị trí tầng dưới gần cửa, giữ chỗ 10 phút thanh toán rất yên tâm.",
    },
    {
      id: "rev-3",
      customer_name: "Đỗ Văn Minh",
      initials: "ĐV",
      route_info: "Tuyến: Hà Nội ⇄ Sa Pa (Cabin VIP)",
      rating: 5,
      comment:
        "Lần đầu đặt vé khi chưa đăng nhập, sau đó login bằng Google thấy hệ thống tự động đồng bộ vé vào mục Vé của tôi rất thông minh. Lên xe chỉ cần đưa mã QR cho phụ xe quét là xong.",
    },
  ];
}