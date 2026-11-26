// src/types/booking.ts

export type BookingStatus =
  | "PENDING"
  | "PAID"
  | "EXPIRED"
  | "CHECKED_IN"
  | "CANCELLED_PENDING_REFUND"
  | "REFUNDED";

export type CoachLayoutType = "LIMOUSINE_22" | "SLEEPER_36" | "SEATER_45";

export interface RouteStopItem {
  id: string;
  route_id: string;
  location_id: string;
  station_name: string;
  address: string;
  stop_type: "PICKUP" | "DROPOFF";
  offset_minutes: number;
  time_label: string;
  surcharge?: number;
}

export interface TripSearchResult {
  id: string;
  route_id: string;
  coach_id: string;
  operator_id: string;
  operator_name: string;
  operator_rating: number;
  operator_reviews: number;
  license_plate: string;
  coach_type: CoachLayoutType;
  coach_type_label: string;
  departure_province: string;
  destination_province: string;
  departure_station: string;
  destination_station: string;
  departure_time: string; // HH:mm
  arrival_time: string;   // HH:mm
  departure_date: string; // YYYY-MM-DD
  duration_label: string;
  ticket_price: number;
  available_seats: number;
  total_seats: number;
  badges: string[];
  amenities: string[];
  pickup_stops: RouteStopItem[];
  dropoff_stops: RouteStopItem[];
}

export type SeatVisualState = "AVAILABLE" | "OCCUPIED" | "LOCKED_PENDING";

export interface SeatCell {
  seat_code: string; // VD: A01, A02, B01...
  deck: 1 | 2;       // Tầng 1 (Dưới) | Tầng 2 (Trên)
  row: number;
  col: number;
  price: number;
  state: SeatVisualState;
  label_note?: string;
}

export interface ElectronicTicketData {
  booking_code: string;
  qr_token: string;
  status: BookingStatus;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  operator_name: string;
  license_plate: string;
  coach_type_label: string;
  departure_province: string;
  destination_province: string;
  departure_time: string;
  arrival_time: string;
  departure_date: string;
  pickup_station: string;
  pickup_address: string;
  dropoff_station: string;
  dropoff_address: string;
  seat_codes: string[];
  total_amount: number;
  payment_provider: "SEPAY_VIETQR" | "MOMO";
  transaction_id: string;
  paid_at: string;
}