// src/types/tms.ts

export interface OperatorTripScheduleItem {
  id: string;
  trip_code: string;
  departure_time: string;
  arrival_time: string;
  duration_label: string;
  origin_station: string;
  destination_station: string;
  shuttle_note: string;
  coach_model: string;
  coach_sub_label: string;
  license_plate: string;
  driver_name: string;
  driver_meta: string;
  booked_seats: number;
  total_seats: number;
  ticket_price: number;
  price_note: string;
  operational_status: "BOARDING" | "RUNNING_GPS" | "UPCOMING" | "OPEN_SALE" | "DELAYED";
  status_label: string;
  gate_or_eta_note: string;
}

export interface ManifestSeatPassenger {
  seat_code: string;
  floor: 1 | 2;
  passenger_name: string;
  passenger_phone: string;
  pickup_point: string;
  dropoff_point: string;
  booking_channel: string;
  payment_method: "VietQR" | "MoMo" | "--";
  check_in_status: "CHECKED_IN" | "PAID_WAITING" | "LOCKED";
  seat_state: "PAID" | "AVAILABLE" | "LOCKED";
  baggage_note: string;
  ticket_price: number;
}

export interface AdminFleetOperatorItem {
  id: string;
  code: string;
  short_code: string;
  name: string;
  tier_badge: string;
  key_routes: string;
  frequency_note: string;
  fleet_count: number;
  fleet_type_note: string;
  monthly_gmv: number;
  growth_label: string;
  rating: number;
  reviews_count: number;
  commission_rate: number;
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
}

export interface OperatorSettlementRow {
  operator_id: string;
  short_code: string;
  operator_name: string;
  routes_summary: string;
  total_tickets: number;
  gross_gmv: number;
  vietqr_amount: number;
  momo_amount: number;
  platform_commission: number;
  net_payout: number;
  settlement_status: "CONFIRMED" | "PAID_OUT" | "WAITING_CONFIRM" | "REFUND_PENDING";
  ref_code: string;
  bank_name: string;
  bank_account: string;
}

export interface RealtimeWebhookFeedItem {
  id: string;
  booking_code: string;
  provider: "VietQR (SePay)" | "Ví MoMo";
  reference_id: string;
  customer_name: string;
  operator_name: string;
  amount: number;
  time_ago: string;
}