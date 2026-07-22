import type { DbRole } from "@/lib/auth/roles";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: DbRole;
  is_dealer: boolean;
  business_name: string | null;
  is_registered_business: boolean;
  business_registration_number: string | null;
  business_documents: string[] | null;
  address: string | null;
  city: string | null;
  bio: string | null;
  preferred_contact_method: "phone" | "email" | "whatsapp" | null;
  website: string | null;
  years_in_operation: number | null;
  created_at?: string;
  updated_at?: string;
}
