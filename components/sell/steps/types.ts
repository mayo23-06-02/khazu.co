export interface CarData {
  regNumber: string;
  make: string;
  model: string;
  year: string;
  mileage: string;
  bodyType: string;
  fuelType: string;
  transmission: string;
  driveType: string;
  engineSize: string;
  power: string;
  torque: string;
  doors: string;
  seats: string;
  colour: string;
  condition: string;
  features: string[];
  description: string;
  price: string;
  negotiable: boolean;
  images: File[];
  sellerType: string;
  acceptsInstallments: boolean;
  depositAmount: string;
  installmentMonths: string;
}

export interface AuthData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: "personal" | "dealer";
  dealerName: string;
  termsAccepted: boolean;
}

export const initialCarData: CarData = {
  regNumber: "",
  make: "",
  model: "",
  year: "",
  mileage: "",
  bodyType: "",
  fuelType: "",
  transmission: "",
  driveType: "",
  engineSize: "",
  power: "",
  torque: "",
  doors: "",
  seats: "",
  colour: "",
  condition: "good",
  features: [],
  description: "",
  price: "",
  negotiable: true,
  images: [],
  sellerType: "individual",
  acceptsInstallments: false,
  depositAmount: "",
  installmentMonths: "6",
};

export const initialAuthData: AuthData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "personal",
  dealerName: "",
  termsAccepted: false,
};
