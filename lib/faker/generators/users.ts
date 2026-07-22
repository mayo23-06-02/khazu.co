import { faker } from '@faker-js/faker'
import { User, UserRole } from '../../../types/user'

export function generateUsers(): User[] {
  const users: User[] = []

  // 1 Admin
  users.push({
    id: faker.string.uuid(),
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@khazu.co.sz',
    phone: faker.phone.number(),
    role: UserRole.ADMIN,
    isVerified: true,
    freeListingsRemaining: 0,
    createdAt: faker.date.past(),
  })

  // 20 Dealers
  for (let i = 0; i < 20; i++) {
    users.push({
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      role: UserRole.DEALER,
      dealerName: faker.company.name() + ' Motors',
      isVerified: faker.datatype.boolean(0.7),
      freeListingsRemaining: faker.number.int({ min: 0, max: 10 }),
      createdAt: faker.date.past(),
    })
  }

  // 50 Personal Sellers
  for (let i = 0; i < 50; i++) {
    users.push({
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      role: UserRole.PERSONAL,
      isVerified: faker.datatype.boolean(0.3),
      freeListingsRemaining: 0,
      createdAt: faker.date.past(),
    })
  }

  return users
}
