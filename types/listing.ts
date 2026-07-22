export type ListingStatus = "draft" | "active" | "sold" | "archived";
export type SellerType = "individual" | "dealer";
export type ListingEventType =
  | "view"
  | "like"
  | "unlike"
  | "comment"
  | "contact"
  | "boost_started"
  | "boost_ended"
  | "status_change";

export interface Listing {
  id: string;
  seller_id: string;
  seller_type: SellerType;
  reg_number: string | null;
  make: string;
  model: string;
  year: number;
  mileage: number;
  body_type: string | null;
  fuel_type: string | null;
  transmission: string | null;
  drive_type: string | null;
  engine_size: string | null;
  power_kw: number | null;
  torque_nm: number | null;
  doors: number | null;
  seats: number | null;
  colour: string | null;
  condition: string | null;
  features: string[] | null;
  description: string | null;
  price: number;
  previous_price: number | null;
  negotiable: boolean;
  accepts_installments: boolean;
  deposit_amount: number | null;
  installment_months: number | null;
  images: string[] | null;
  status: ListingStatus;
  is_featured: boolean;
  is_verified: boolean;
  views_count: number;
  contacts_count: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface ListingEvent {
  id: string;
  listing_id: string;
  seller_id: string;
  actor_id: string | null;
  event_type: ListingEventType;
  message: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  listings?: Pick<Listing, "make" | "model" | "year"> | null;
}

export interface ListingDailyStat {
  listing_id: string;
  seller_id: string;
  day: string;
  views: number;
  likes: number;
  comments: number;
  contacts: number;
}

export interface ListingBoost {
  id: string;
  listing_id: string;
  seller_id: string;
  amount_szl: number;
  starts_at: string;
  ends_at: string;
  status: "active" | "expired" | "cancelled";
  created_at: string;
}
