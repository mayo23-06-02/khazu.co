import { UserRole } from "./user";

export interface Car {
  id: string;
  regNumber: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  bodyType: string;
  fuelType: string;
  transmission: string;
  driveType: string;
  engineSize: string;
  power?: number;
  torque?: number;
  doors?: number;
  seats?: number;
  colour?: string;
  condition: string;
  features: string[];
  description: string;
  price: number;
  negotiable: boolean;
  images: string[];
  sellerId: string;
  sellerType: UserRole.PERSONAL | UserRole.DEALER;
  status: 'draft' | 'active' | 'sold';
  isFeatured: boolean;
  isVerified: boolean;
  views: number;
  contacts: number;
  createdAt: Date;
  updatedAt: Date;
}
