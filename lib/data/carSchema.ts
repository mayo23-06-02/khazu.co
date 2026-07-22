export interface Car {
  id: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  fuel: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'
  transmission: 'Manual' | 'Automatic' | 'CVT'
  bodyType: 'Sedan' | 'Hatchback' | 'SUV' | 'Pickup' | 'Coupe' | 'Convertible' | 'Wagon'
  spec?: string
  statusLabel?: string
  priceDropPercentage?: number
  color: string
  doors: number
  seats: number
  engineSize: string
  power: number
  torque: number
  driveType: 'FWD' | 'RWD' | 'AWD' | '4WD'
  fuelConsumption: {
    city: number
    highway: number
    combined: number
  }
  co2Emissions: number
  acceleration: {
    '0-100kmh': number
    topSpeed: number
  }
  dimensions: {
    length: number
    width: number
    height: number
    wheelbase: number
    groundClearance: number
  }
  weight: {
    kerb: number
    gross: number
    towingCapacity?: number
  }
  features: string[]
  safetyFeatures: string[]
  entertainmentFeatures: string[]
  description: string
  location: string
  sellerType: 'private' | 'dealer'
  acceptsInstallments?: boolean
  depositAmount?: number
  installmentMonths?: number
  sellerName: string
  sellerPhone: string
  sellerEmail: string
  dealerId?: string
  images: string[]
  isFeatured: boolean
  isVerified: boolean
  isSold: boolean
  createdAt: string
  updatedAt: string
  views: number
  contacts: number
  saves: number
  valueScore: number
  conditionScore: number
  dealRating: 'Great' | 'Good' | 'Fair' | 'Overpriced'
  marketRank: number
  annualDistance: number
  remainingLifespan: number
  majorServiceDue: 'Soon' | 'Due' | 'Overdue' | 'None'
  tireWear: number
  brakeWear: number
  batteryHealth?: number
}
