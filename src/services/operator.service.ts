// src/services/operator.service.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ManifestPassengerRow, OperatorTripRow } from "@/types/portal";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getOperatorScheduleTrips(): Promise<OperatorTripRow[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("trips")
      .select(`
        id, trip_code, departure_time, arrival_time, ticket_price, status,
        routes(departure_province, destination_province),
        coaches(license_plate, coach_type),
        booking_seats(id)
      `)
      .order("departure_time");
    if (error) console.error("Supabase operator trips unavailable:", error.message);
    if (data) {
      return data.map((trip: any) => {
        const coachType = trip.coaches?.coach_type;
        const totalSeats = coachType === "LIMOUSINE_22" ? 22 : coachType === "SLEEPER_36" ? 36 : 45;
        const route = trip.routes;
        const departure = new Date(trip.departure_time);
        const arrival = new Date(trip.arrival_time);
        return {
          id: trip.id,
          trip_code: trip.trip_code || trip.id.slice(0, 8).toUpperCase(),
          route_name: `${route?.departure_province || ""} ➔ ${route?.destination_province || ""}`,
          departure_station: "Bến xe / VP nhà xe",
          destination_station: "Điểm đến tuyến",
          departure_time: departure.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" }),
          arrival_time: arrival.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" }) + " (+1)",
          license_plate: trip.coaches?.license_plate || "",
          coach_type_label: coachType === "LIMOUSINE_22" ? "Limousine 22 Phòng" : coachType === "SLEEPER_36" ? "Giường Nằm 36 Chỗ" : "Ghế Ngồi 45 Chỗ",
          driver_name: "Đang cập nhật",
          booked_seats: trip.booking_seats?.length || 0,
          total_seats: totalSeats,
          ticket_price: Number(trip.ticket_price),
          status: trip.status as OperatorTripRow["status"],
        };
      });
    }
  }

  return [
    {
      id: "trip-op-1",
      trip_code: "TRIP-DL-2200",
      route_name: "TP.HCM ➔ Đà Lạt",
      departure_station: "BX Miền Đông Mới",
      destination_station: "BX Liên Tỉnh Đà Lạt",
      departure_time: "22:00",
      arrival_time: "04:30 (+1)",
      license_plate: "51B-298.12",
      coach_type_label: "Limousine 22 Phòng",
      driver_name: "Lê Văn Hùng • Phạm Quốc Bảo",
      booked_seats: 20,
      total_seats: 22,
      ticket_price: 450000,
      status: "BOARDING",
    },
    {
      id: "trip-op-2",
      trip_code: "TRIP-DL-2230",
      route_name: "TP.HCM ➔ Đà Lạt",
      departure_station: "VP Hàng Xanh",
      destination_station: "BX Liên Tỉnh Đà Lạt",
      departure_time: "22:30",
      arrival_time: "05:00 (+1)",
      license_plate: "51B-451.88",
      coach_type_label: "Giường Nằm 34 Chỗ",
      driver_name: "Trần Đình Trọng • Ngô Văn Nam",
      booked_seats: 28,
      total_seats: 34,
      ticket_price: 340000,
      status: "SCHEDULED",
    },
    {
      id: "trip-op-3",
      trip_code: "TRIP-NT-2130",
      route_name: "TP.HCM ➔ Nha Trang",
      departure_station: "BX Miền Đông Mới",
      destination_station: "BX Phía Nam Nha Trang",
      departure_time: "21:30",
      arrival_time: "05:00 (+1)",
      license_plate: "51B-772.05",
      coach_type_label: "Limousine 22 Phòng",
      driver_name: "Nguyễn Hữu Thắng",
      booked_seats: 22,
      total_seats: 22,
      ticket_price: 420000,
      status: "ON_ROUTE",
    },
    {
      id: "trip-op-4",
      trip_code: "TRIP-PT-1400",
      route_name: "TP.HCM ➔ Phan Thiết",
      departure_station: "VP Quận 1",
      destination_station: "BX Bắc Phan Thiết",
      departure_time: "14:00",
      arrival_time: "16:45",
      license_plate: "51B-309.41",
      coach_type_label: "Ghế Ngồi 45 Chỗ",
      driver_name: "Đặng Quốc Tuấn",
      booked_seats: 45,
      total_seats: 45,
      ticket_price: 180000,
      status: "COMPLETED",
    },
  ];
}

export async function getTripManifestPassengers(
  tripId: string
): Promise<ManifestPassengerRow[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("booking_seats")
      .select(`
        seat_code, booking_id,
        bookings(booking_code, customer_name, customer_phone, status)
      `)
      .eq("trip_id", tripId);
    if (error) console.error("Supabase manifest unavailable:", error.message);
    if (data) {
      return data.map((row: any) => {
        const booking = row.bookings;
        return {
          booking_id: row.booking_id,
          booking_code: booking?.booking_code || "",
          seat_code: row.seat_code,
          customer_name: booking?.customer_name || "",
          customer_phone: booking?.customer_phone || "",
          pickup_point: "Điểm đón trên vé",
          dropoff_point: "Điểm trả trên vé",
          payment_status: booking?.status === "PAID" || booking?.status === "CHECKED_IN" ? "PAID" : "PENDING",
          checkin_status: booking?.status === "CHECKED_IN" ? "CHECKED_IN" : "WAITING",
        };
      });
    }
  }

  return [
    {
      booking_id: "bk-1",
      booking_code: "VVC-261118-8892",
      seat_code: "A01",
      customer_name: "Nguyễn Hà Thành",
      customer_phone: "0912 345 678",
      pickup_point: "BX Miền Đông Mới (22:00)",
      dropoff_point: "BX Liên tỉnh Đà Lạt",
      payment_status: "PAID",
      checkin_status: "CHECKED_IN",
    },
    {
      booking_id: "bk-2",
      booking_code: "VVC-261118-8893",
      seat_code: "A02",
      customer_name: "Trần Hoàng Long",
      customer_phone: "0988 112 334",
      pickup_point: "VP Hàng Xanh (21:30)",
      dropoff_point: "Trung chuyển Chợ Đà Lạt",
      payment_status: "PAID",
      checkin_status: "WAITING",
    },
    {
      booking_id: "bk-3",
      booking_code: "VVC-261118-8901",
      seat_code: "B01",
      customer_name: "Lê Minh Châu",
      customer_phone: "0903 556 778",
      pickup_point: "BX Miền Đông Mới (22:00)",
      dropoff_point: "BX Liên tỉnh Đà Lạt",
      payment_status: "PAID",
      checkin_status: "CHECKED_IN",
    },
    {
      booking_id: "bk-4",
      booking_code: "VVC-261118-8915",
      seat_code: "B04",
      customer_name: "Phạm Quốc Anh",
      customer_phone: "0937 889 001",
      pickup_point: "VP Hàng Xanh (21:30)",
      dropoff_point: "Hồ Tuyền Lâm",
      payment_status: "PENDING",
      checkin_status: "WAITING",
    },
  ];
}