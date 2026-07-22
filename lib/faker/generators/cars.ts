import { faker } from '@faker-js/faker'
import { Car } from '../../../types/car'
import { User, UserRole } from '../../../types/user'

const MAKES = ['Toyota', 'VW', 'BMW', 'Mercedes-Benz', 'Nissan', 'Ford', 'Isuzu', 'Honda']
const MODELS: Record<string, string[]> = {
  Toyota: ['Hilux', 'Corolla', 'Fortuner', 'Land Cruiser', 'Quantum'],
  VW: ['Golf', 'Polo', 'Tiguan', 'Amarok', 'Jetta'],
  BMW: ['3 Series', '5 Series', 'X5', 'X3', 'M3'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLE', 'S-Class', 'A-Class'],
  Nissan: ['NP200', 'Navara', 'X-Trail', 'Almera', 'Qashqai'],
  Ford: ['Ranger', 'Everest', 'EcoSport', 'Focus', 'Fiesta'],
  Isuzu: ['D-Max', 'MU-X', 'KB'],
  Honda: ['Civic', 'CR-V', 'Jazz', 'Accord']
}

export function generateCars(users: User[]): Car[] {
  const cars: Car[] = []
  const sellers = users.filter(u => u.role !== UserRole.ADMIN)

  for (let i = 0; i < 200; i++) {
    const seller = faker.helpers.arrayElement(sellers)
    const make = faker.helpers.arrayElement(MAKES)
    const model = faker.helpers.arrayElement(MODELS[make])

    cars.push({
      id: faker.string.uuid(),
      regNumber: `MBN ${faker.number.int({ min: 100, max: 999 })} ESW`,
      make,
      model,
      year: faker.number.int({ min: 2010, max: 2024 }),
      mileage: faker.number.int({ min: 0, max: 250000 }),
      bodyType: faker.helpers.arrayElement(['SUV', 'Sedan', 'Hatchback', 'Bakkie', 'Crossover']),
      fuelType: faker.helpers.arrayElement(['Petrol', 'Diesel', 'Hybrid', 'Electric']),
      transmission: faker.helpers.arrayElement(['Automatic', 'Manual']),
      driveType: faker.helpers.arrayElement(['4x4', 'RWD', 'FWD', 'AWD']),
      engineSize: faker.number.float({ min: 1.0, max: 5.0, fractionDigits: 1 }).toString(),
      condition: faker.helpers.arrayElement(['Excellent', 'Good', 'Fair', 'New']),
      features: faker.helpers.multiple(() => faker.vehicle.fuel(), { count: { min: 3, max: 8 } }),
      description: faker.lorem.paragraph(),
      price: faker.number.int({ min: 50000, max: 950000 }),
      negotiable: faker.datatype.boolean(),
      images: [faker.image.urlPicsumPhotos({ width: 800, height: 600 }), faker.image.urlPicsumPhotos({ width: 800, height: 600 })],
      sellerId: seller.id,
      sellerType: seller.role as UserRole.PERSONAL | UserRole.DEALER,
      status: faker.helpers.weightedArrayElement([
        { value: 'active', weight: 85 },
        { value: 'sold', weight: 15 }
      ]) as 'active' | 'sold',
      isFeatured: faker.datatype.boolean(0.1),
      isVerified: faker.datatype.boolean(0.3),
      views: faker.number.int({ min: 0, max: 1000 }),
      contacts: faker.number.int({ min: 0, max: 50 }),
      createdAt: faker.date.recent({ days: 60 }),
      updatedAt: new Date()
    })
  }

  return cars
}
