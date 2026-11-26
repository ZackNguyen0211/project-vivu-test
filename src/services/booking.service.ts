/* eslint-disable @typescript-eslint/no-explicit-any */

// src/services/booking.service.ts
import {
  ElectronicTicketData,
  SeatCell,
  TripSearchResult,
} from "@/types/booking";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function formatVietnamTime(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function formatOffsetTime(departureTime: string, offsetMinutes: number): string {
  const date = new Date(departureTime);
  date.setUTCMinutes(date.getUTCMinutes() + offsetMinutes);
  return formatVietnamTime(date.toISOString());
}

function seatTotal(coachType?: string): number {
  if (coachType === "LIMOUSINE_22") return 22;
  if (coachType === "SLEEPER_36") return 36;
  return 45;
}

function coachLabel(coachType?: string): string {
  if (coachType === "LIMOUSINE_22") return "Limousine 22 Phòng VIP";
  if (coachType === "SLEEPER_36") return "Giường Nằm 36 Chỗ";
  return "Ghế Ngồi 45 Chỗ";
}

/**
 * PLACEHOLDER: Tìm kiếm chuyến xe mở bán (GET /api/v1/public/trips/search)
 * Khi nối Supabase: Truy vấn bảng `trips` JOIN `routes`, `coaches`, `operators` và đếm `booking_seats`
 */
export async function searchAvailableTrips(params: {
  from?: string;
  to?: string;
  date?: string;
}): Promise<TripSearchResult[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const fromCity = params.from || "TP. Hồ Chí Minh";
    const toCity = params.to || "Đà Lạt (Lâm Đồng)";
    const dateStr = params.date || new Date().toISOString().slice(0, 10);

    const query = supabase
      .from("trips")
      .select(`
        id, route_id, coach_id, departure_time, arrival_time, ticket_price,
        routes!inner(departure_province, destination_province, estimated_duration_minutes, operator_id,
          operators(id, name, rating, review_count_label),
          route_stops(id, route_id, location_id, stop_type, offset_minutes, station_name, address)),
        coaches!inner(coach_type, license_plate)
      `)
      .eq("routes.departure_province", fromCity)
      .eq("routes.destination_province", toCity)
      .gte("departure_time", `${dateStr}T00:00:00+07:00`)
      .lt("departure_time", `${dateStr}T23:59:59+07:00`)
      .in("status", ["SCHEDULED", "BOARDING", "ON_ROUTE"])
      .order("departure_time");

    const { data, error } = await query;
    if (error) {
      console.error("Supabase trips search unavailable:", error.message);
    } else if (data) {
      const tripIds = data.map((trip) => trip.id);
      const { data: seats } = await supabase
        .from("booking_seats")
        .select("trip_id")
        .in("trip_id", tripIds);

      return data.map((trip: any) => {
        const route = trip.routes;
        const operator = route?.operators;
        const coach = trip.coaches;
        const pickupStops = (route?.route_stops || [])
          .filter((stop: any) => stop.stop_type === "PICKUP")
          .map((stop: any) => ({
            ...stop,
            time_label: formatOffsetTime(trip.departure_time, stop.offset_minutes),
          }));
        const dropoffStops = (route?.route_stops || [])
          .filter((stop: any) => stop.stop_type === "DROPOFF")
          .map((stop: any) => ({
            ...stop,
            time_label: formatOffsetTime(trip.departure_time, route.estimated_duration_minutes),
          }));
        const totalSeats = seatTotal(coach?.coach_type);
        const bookedSeats = (seats || []).filter((seat) => seat.trip_id === trip.id).length;

        return {
          id: trip.id,
          route_id: trip.route_id,
          coach_id: trip.coach_id,
          operator_id: operator?.id || route?.operator_id || "",
          operator_name: operator?.name || "Nhà xe ViVu",
          operator_rating: Number(operator?.rating || 0),
          operator_reviews: 0,
          license_plate: coach?.license_plate || "",
          coach_type: coach?.coach_type || "SEATER_45",
          coach_type_label: coachLabel(coach?.coach_type),
          departure_province: route?.departure_province,
          destination_province: route?.destination_province,
          departure_station: pickupStops[0]?.station_name || "",
          destination_station: dropoffStops[0]?.station_name || "",
          departure_time: formatVietnamTime(trip.departure_time),
          arrival_time: formatVietnamTime(trip.arrival_time),
          departure_date: dateStr,
          duration_label: `${Math.floor(route.estimated_duration_minutes / 60)}h ${route.estimated_duration_minutes % 60}m`,
          ticket_price: Number(trip.ticket_price),
          available_seats: Math.max(0, totalSeats - bookedSeats),
          total_seats: totalSeats,
          badges: ["Xác nhận tức thì", "Khung giờ linh hoạt"],
          amenities: ["Nước suối", "Cổng sạc", "Điều hòa"],
          pickup_stops: pickupStops,
          dropoff_stops: dropoffStops,
        } as TripSearchResult;
      });
    }
  }

  const fromCity = params.from || "TP. Hồ Chí Minh";
  const toCity = params.to || "Đà Lạt (Lâm Đồng)";
  const dateStr = params.date || "2026-11-20";

  return [
    {
      id: "trip-futa-2200",
      route_id: "route-sg-dl",
      coach_id: "coach-51b-29812",
      operator_id: "op-futa",
      operator_name: "Phương Trang (FUTA Bus Lines)",
      operator_rating: 4.9,
      operator_reviews: 3420,
      license_plate: "51B-298.12",
      coach_type: "LIMOUSINE_22",
      coach_type_label: "Limousine 22 Phòng Đôi/Đơn VIP",
      departure_province: fromCity,
      destination_province: toCity,
      departure_station: "Bến xe Miền Đông Mới",
      destination_station: "Bến xe Liên tỉnh Đà Lạt",
      departure_time: "22:00",
      arrival_time: "04:30",
      departure_date: dateStr,
      duration_label: "6h 30m",
      ticket_price: 450000,
      available_seats: 8,
      total_seats: 22,
      badges: ["Xác nhận tức thì", "Xe trung chuyển miễn phí", "Chạy cao tốc"],
      amenities: ["Màn hình riêng", "Ghế Massage", "Cổng sạc Type-C", "Chăn gối sạch"],
      pickup_stops: [
        {
          id: "stop-p1",
          route_id: "route-sg-dl",
          location_id: "loc-hcm-1",
          station_name: "VP Hàng Xanh (486 Điện Biên Phủ)",
          address: "486 Điện Biên Phủ, P.21, Bình Thạnh, TP.HCM",
          stop_type: "PICKUP",
          offset_minutes: 0,
          time_label: "21:30",
        },
        {
          id: "stop-p2",
          route_id: "route-sg-dl",
          location_id: "loc-hcm-2",
          station_name: "Bến xe Miền Đông Mới (Quầy số 12)",
          address: "501 Hoàng Hữu Nam, Long Bình, TP. Thủ Đức",
          stop_type: "PICKUP",
          offset_minutes: 30,
          time_label: "22:00",
        },
      ],
      dropoff_stops: [
        {
          id: "stop-d1",
          route_id: "route-sg-dl",
          location_id: "loc-dl-1",
          station_name: "Bến xe Liên tỉnh Đà Lạt",
          address: "01 Tô Hiến Thành, Phường 3, TP. Đà Lạt",
          stop_type: "DROPOFF",
          offset_minutes: 390,
          time_label: "04:30",
        },
        {
          id: "stop-d2",
          route_id: "route-sg-dl",
          location_id: "loc-dl-2",
          station_name: "Trung chuyển nội thành Đà Lạt (Bán kính 7km)",
          address: "Đưa đón tận Khách sạn / Homestay trung tâm",
          stop_type: "DROPOFF",
          offset_minutes: 410,
          time_label: "04:50",
        },
      ],
    },
    {
      id: "trip-thanhbuoi-2300",
      route_id: "route-sg-dl",
      coach_id: "coach-51b-44109",
      operator_id: "op-thanhbuoi",
      operator_name: "Thành Bưởi Limousine",
      operator_rating: 4.8,
      operator_reviews: 2190,
      license_plate: "51B-441.09",
      coach_type: "SLEEPER_36",
      coach_type_label: "Giường Nằm 34 Phòng Cung Điện",
      departure_province: fromCity,
      destination_province: toCity,
      departure_station: "VP Lê Hồng Phong (Quận 5)",
      destination_station: "VP Phan Bội Châu (Chợ Đà Lạt)",
      departure_time: "23:00",
      arrival_time: "05:15",
      departure_date: dateStr,
      duration_label: "6h 15m",
      ticket_price: 340000,
      available_seats: 14,
      total_seats: 34,
      badges: ["Giữ chỗ 100%", "Rèm che riêng tư"],
      amenities: ["WiFi 5G", "Nước suối & khăn", "Cổng USB"],
      pickup_stops: [
        {
          id: "stop-p3",
          route_id: "route-sg-dl",
          location_id: "loc-hcm-3",
          station_name: "VP 266 Lê Hồng Phong, Quận 5",
          address: "266 Lê Hồng Phong, P.4, Quận 5, TP.HCM",
          stop_type: "PICKUP",
          offset_minutes: 0,
          time_label: "23:00",
        },
      ],
      dropoff_stops: [
        {
          id: "stop-d3",
          route_id: "route-sg-dl",
          location_id: "loc-dl-3",
          station_name: "VP 55 Phan Bội Châu, Đà Lạt",
          address: "55 Phan Bội Châu, Phường 1, TP. Đà Lạt",
          stop_type: "DROPOFF",
          offset_minutes: 375,
          time_label: "05:15",
        },
      ],
    },
    {
      id: "trip-kumho-0800",
      route_id: "route-sg-dl",
      coach_id: "coach-51b-88201",
      operator_id: "op-kumho",
      operator_name: "Kumho Samco Express",
      operator_rating: 4.7,
      operator_reviews: 1280,
      license_plate: "51B-882.01",
      coach_type: "SEATER_45",
      coach_type_label: "Ghế Ngả Thư Giãn 45 Chỗ",
      departure_province: fromCity,
      destination_province: toCity,
      departure_station: "Bến xe Miền Đông Mới",
      destination_station: "Bến xe Liên tỉnh Đà Lạt",
      departure_time: "08:00",
      arrival_time: "14:30",
      departure_date: dateStr,
      duration_label: "6h 30m",
      ticket_price: 260000,
      available_seats: 21,
      total_seats: 45,
      badges: ["Tiết kiệm nhất", "Chuyến ngày ngắm cảnh"],
      amenities: ["Điều hòa mát lạnh", "Nước uống"],
      pickup_stops: [
        {
          id: "stop-p4",
          route_id: "route-sg-dl",
          location_id: "loc-hcm-2",
          station_name: "Bến xe Miền Đông Mới",
          address: "501 Hoàng Hữu Nam, TP. Thủ Đức",
          stop_type: "PICKUP",
          offset_minutes: 0,
          time_label: "08:00",
        },
      ],
      dropoff_stops: [
        {
          id: "stop-d4",
          route_id: "route-sg-dl",
          location_id: "loc-dl-1",
          station_name: "Bến xe Liên tỉnh Đà Lạt",
          address: "01 Tô Hiến Thành, Phường 3, Đà Lạt",
          stop_type: "DROPOFF",
          offset_minutes: 390,
          time_label: "14:30",
        },
      ],
    },
  ];
}

/**
 * PLACEHOLDER: Lấy chi tiết chuyến và Sơ đồ ghế 2 tầng (GET /api/v1/public/trips/:id/seats)
 * Áp dụng công thức Lazy Evaluation:
 * status IN ('PAID', 'CHECKED_IN') OR (status = 'PENDING' AND expired_at > NOW())
 */
export async function getTripSeatMap(tripId: string): Promise<{
  trip: TripSearchResult;
  seats: SeatCell[];
}> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const trips = await searchAvailableTrips({});
    const trip = trips.find((item) => item.id === tripId) || trips[0];
    if (!trip) throw new Error("Trip not found");

    const { data: occupied, error } = await supabase
      .from("booking_seats")
      .select("seat_code, bookings(status, expired_at)")
      .eq("trip_id", tripId);

    if (error) console.error("Supabase seat map unavailable:", error.message);

    const occupiedCodes = new Set<string>();
    const lockedCodes = new Set<string>();
    (occupied || []).forEach((seat: any) => {
      const booking = seat.bookings;
      if (
        booking?.status === "PAID" ||
        booking?.status === "CHECKED_IN" ||
        booking?.status === "CANCELLED_PENDING_REFUND"
      ) {
        occupiedCodes.add(seat.seat_code);
      } else if (
        booking?.status === "PENDING" &&
        booking.expired_at &&
        new Date(booking.expired_at).getTime() > Date.now()
      ) {
        lockedCodes.add(seat.seat_code);
      }
    });

    const totalSeats = trip.total_seats;
    const seats: SeatCell[] = [];
    for (let i = 1; i <= totalSeats; i++) {
      const deck = i <= Math.ceil(totalSeats / 2) ? 1 : 2;
      const prefix = deck === 1 ? "A" : "B";
      const indexInDeck = deck === 1 ? i : i - Math.ceil(totalSeats / 2);
      const code = `${prefix}${String(indexInDeck).padStart(2, "0")}`;
      const state: SeatCell["state"] = occupiedCodes.has(code)
        ? "OCCUPIED"
        : lockedCodes.has(code)
          ? "LOCKED_PENDING"
          : "AVAILABLE";
      seats.push({
        seat_code: code,
        deck: deck as 1 | 2,
        row: Math.ceil(indexInDeck / (trip.coach_type === "SEATER_45" ? 3 : 2)),
        col: ((indexInDeck - 1) % (trip.coach_type === "SEATER_45" ? 3 : 2)) + 1,
        price: trip.ticket_price,
        state,
      });
    }

    return { trip, seats };
  }

  const trips = await searchAvailableTrips({});
  const trip = trips.find((t) => t.id === tripId) || trips[0];

  const occupiedCodes = new Set(["A01", "A02", "A05", "B01", "B02", "B06"]);
  const lockedPendingCodes = new Set(["A08", "B04"]);

  const seats: SeatCell[] = [];
  // Sinh sơ đồ 22 phòng (11 phòng Tầng 1 - dãy A, 11 phòng Tầng 2 - dãy B)
  for (let deck = 1; deck <= 2; deck++) {
    const prefix = deck === 1 ? "A" : "B";
    for (let i = 1; i <= 11; i++) {
      const code = `${prefix}${String(i).padStart(2, "0")}`;
      const row = Math.ceil(i / 2);
      const col = i % 2 === 1 ? 1 : 2;
      let state: SeatCell["state"] = "AVAILABLE";
      if (occupiedCodes.has(code)) state = "OCCUPIED";
      else if (lockedPendingCodes.has(code)) state = "LOCKED_PENDING";

      seats.push({
        seat_code: code,
        deck: deck as 1 | 2,
        row,
        col,
        price: trip.ticket_price,
        state,
        label_note: row <= 2 ? "Đầu xe êm ái" : row >= 5 ? "Cuối xe yên tĩnh" : "Giữa xe cân bằng",
      });
    }
  }

  return { trip, seats };
}

/**
 * PLACEHOLDER: Sinh URL ảnh QR động chuẩn SePay VietQR
 */
export function buildSepayVietQrUrl(params: {
  bankName?: string;
  accountNo?: string;
  amount: number;
  bookingCode: string;
}): string {
  const bank = params.bankName || "MBBank";
  const acc = params.accountNo || "0912345678999";
  return `https://qr.sepay.vn/img?bank=${encodeURIComponent(
    bank
  )}&acc=${encodeURIComponent(acc)}&template=compact&amount=${
    params.amount
  }&des=${encodeURIComponent(params.bookingCode)}`;
}

/**
 * PLACEHOLDER: Lấy thông tin Vé điện tử bằng booking_code (GET /api/v1/bookings/lookup)
 */
export async function getElectronicTicketByCode(
  bookingCode: string
): Promise<ElectronicTicketData> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        booking_code, qr_token, status, customer_name, customer_phone, customer_email,
        total_amount,
        trips(departure_time, arrival_time, ticket_price,
          routes(departure_province, destination_province,
            operators(name)),
          coaches(license_plate, coach_type)),
        booking_seats(seat_code),
        payments(provider, transaction_id, paid_at)
      `)
      .eq("booking_code", bookingCode)
      .maybeSingle();

    if (error) console.error("Supabase ticket unavailable:", error.message);
    if (data) {
      const trip: any = data.trips;
      const route: any = trip?.routes;
      const coach: any = trip?.coaches;
      const payment: any = Array.isArray(data.payments) ? data.payments[0] : data.payments;
      return {
        booking_code: data.booking_code,
        qr_token: data.qr_token || "",
        status: data.status as ElectronicTicketData["status"],
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_email: data.customer_email,
        operator_name: route?.operators?.name || "",
        license_plate: coach?.license_plate || "",
        coach_type_label: coachLabel(coach?.coach_type),
        departure_province: route?.departure_province || "",
        destination_province: route?.destination_province || "",
        departure_time: trip ? formatVietnamTime(trip.departure_time) : "",
        arrival_time: trip ? formatVietnamTime(trip.arrival_time) : "",
        departure_date: trip
          ? new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(trip.departure_time))
          : "",
        pickup_station: "",
        pickup_address: "",
        dropoff_station: "",
        dropoff_address: "",
        seat_codes: (data.booking_seats || []).map((seat: any) => seat.seat_code),
        total_amount: Number(data.total_amount),
        payment_provider: payment?.provider === "MOMO" ? "MOMO" : "SEPAY_VIETQR",
        transaction_id: payment?.transaction_id || "",
        paid_at: payment?.paid_at
          ? new Intl.DateTimeFormat("vi-VN", {
              timeZone: "Asia/Ho_Chi_Minh",
              dateStyle: "short",
              timeStyle: "medium",
            }).format(new Date(payment.paid_at))
          : "",
      };
    }
  }

  return {
    booking_code: bookingCode || "VVC-261118-8892",
    qr_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.VVC-261118-8892.SIG",
    status: "PAID",
    customer_name: "Nguyễn Hà Thành",
    customer_phone: "0912 345 678",
    customer_email: "thanh.nguyen@gmail.com",
    operator_name: "Phương Trang (FUTA Bus Lines)",
    license_plate: "51B-298.12",
    coach_type_label: "Limousine 22 Phòng VIP",
    departure_province: "TP. Hồ Chí Minh",
    destination_province: "Đà Lạt (Lâm Đồng)",
    departure_time: "22:00",
    arrival_time: "04:30",
    departure_date: "20/11/2026",
    pickup_station: "Bến xe Miền Đông Mới (Quầy 12)",
    pickup_address: "501 Hoàng Hữu Nam, P. Long Bình, TP. Thủ Đức",
    dropoff_station: "Bến xe Liên tỉnh Đà Lạt",
    dropoff_address: "01 Tô Hiến Thành, Phường 3, TP. Đà Lạt",
    seat_codes: ["A03", "A04"],
    total_amount: 900000,
    payment_provider: "SEPAY_VIETQR",
    transaction_id: "FT263229901823",
    paid_at: "18/11/2026 - 17:15:08",
  };
}