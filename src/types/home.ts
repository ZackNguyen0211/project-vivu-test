// src/types/home.ts

export type LocationType = "PICKUP" | "DROPOFF" | "BOTH";
export type CoachType = "LIMOUSINE_22" | "SLEEPER_36" | "SEATER_45";

export interface LocationItem {
  id: string;
  province_name: string;
  station_name: string;
  address: string;
  type: LocationType;
}

export interface PopularRouteItem {
  id: string;
  operator_id?: string;
  departure_province: string;
  destination_province: string;
  estimated_duration_minutes: number;
  highway_note: string;
  base_price: number;
  daily_trips_count: number;
  coach_label: string;
  badge_text: string;
  is_hot?: boolean;
  description: string;
  image_url: string;
  amenities: {
    icon: string;
    label: string;
  }[];
}

export interface OperatorSummary {
  id: string;
  name: string;
  short_code: string;
  hotline: string;
  description: string;
  logo_url?: string;
  rating: number;
  review_count_label: string;
  fleet_highlight: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface VoucherItem {
  id: string;
  code: string;
  badge: string;
  icon: string;
  title: string;
  description: string;
  is_vip_club?: boolean;
}

export interface TestimonialItem {
  id: string;
  customer_name: string;
  initials: string;
  route_info: string;
  rating: number;
  comment: string;
}