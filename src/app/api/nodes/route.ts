import { NextRequest, NextResponse } from 'next/server'
import { seedNodesData } from '@/data/seedData'

export async function GET() {
  try {
    // Return seed data for the Bangladesh Power Sector
    return NextResponse.json(seedNodesData)
  } catch (error) {
    console.error('Error fetching nodes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch nodes', details: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // For now, just accept the data without persisting
    // TODO: Persist to database once Prisma client issues are resolved
    return NextResponse.json({ ...body, id: body.id || 'generated-id' }, { status: 201 })
  } catch (error) {
    console.error('Error creating node:', error)
    return NextResponse.json(
      { error: 'Failed to create node', details: String(error) },
      { status: 500 }
    )
  }
}
