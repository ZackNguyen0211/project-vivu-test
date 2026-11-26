// src/types/portal.ts

export interface OperatorTripRow {
  id: string;
  trip_code: string;
  route_name: string;
  departure_station: string;
  destination_station: string;
  departure_time: string;
  arrival_time: string;
  license_plate: string;
  coach_type_label: string;
  driver_name: string;
  booked_seats: number;
  total_seats: number;
  ticket_price: number;
  status: "BOARDING" | "ON_ROUTE" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
}

export interface ManifestPassengerRow {
  booking_id: string;
  booking_code: string;
  seat_code: string;
  customer_name: string;
  customer_phone: string;
  pickup_point: string;
  dropoff_point: string;
  payment_status: "PAID" | "PENDING";
  checkin_status: "CHECKED_IN" | "WAITING";
}

export interface AdminOperatorRow {
  id: string;
  code: string;
  name: string;
  hotline: string;
  active_routes_count: number;
  total_coaches: number;
  monthly_tickets: number;
  gmv_vnd: number;
  commission_rate: number;
  on_time_rate: number;
  status: "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED";
}

export interface AdminPayoutRow {
  id: string;
  settlement_code: string;
  operator_name: string;
  bank_info: string;
  cycle_label: string;
  total_bookings: number;
  gross_amount: number;
  platform_fee: number;
  refund_deduction: number;
  net_payout: number;
  payment_gateway_match: "MATCHED_100" | "DISCREPANCY";
  status: "READY_TO_PAY" | "PAID" | "HOLD";
}