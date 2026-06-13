import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const nodes = await prisma.node.findMany()
    return NextResponse.json(nodes)
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
