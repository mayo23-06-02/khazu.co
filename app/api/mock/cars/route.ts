import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'lib/faker/data/mockData.json')
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Mock data not found. Please run seed script.' }, { status: 404 })
    }
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContent)
    return NextResponse.json(data.cars)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read mock data' }, { status: 500 })
  }
}
