import fs from 'fs'
import path from 'path'
import { generateUsers } from '../lib/faker/generators/users'
import { generateCars } from '../lib/faker/generators/cars'

async function seed() {
  console.log('🌱 Starting mock data generation...')
  
  const users = generateUsers()
  const cars = generateCars(users)

  const mockData = {
    users,
    cars,
    leads: [], // Placeholder for now
    subscriptions: [],
    payments: [],
    analytics: []
  }

  const outputDir = path.join(process.cwd(), 'lib/faker/data')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const outputPath = path.join(outputDir, 'mockData.json')
  fs.writeFileSync(outputPath, JSON.stringify(mockData, null, 2))
  
  console.log(`✅ Success! ${users.length} users and ${cars.length} cars generated.`)
  console.log(`📍 Output: ${outputPath}`)
}

seed().catch(console.error)
