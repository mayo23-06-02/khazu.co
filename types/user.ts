/**
 * UI / dashboard role values.
 * Supabase `profiles.role` stores: individual | dealer | admin
 * (`individual` maps to PERSONAL for existing /dashboard/personal routes).
 */
export enum UserRole {
  PERSONAL = "personal",
  DEALER = "dealer",
  ADMIN = "admin",
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone: string;
  role: UserRole;
  dealerName?: string;
  dealerLogo?: string;
  isVerified: boolean;
  freeListingsRemaining: number;
  createdAt: Date;
}
