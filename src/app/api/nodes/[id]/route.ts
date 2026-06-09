import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const node = await prisma.node.findUnique({
      where: { id: params.id },
      include: {
        children: true,
        edgesFrom: true,
        edgesTo: true,
      },
    })

    if (!node) {
      return NextResponse.json(
        { error: 'Node not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(node)
  } catch (error) {
    console.error('Error fetching node:', error)
    return NextResponse.json(
      { error: 'Failed to fetch node' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const node = await prisma.node.update({
      where: { id: params.id },
      data: body,
      include: {
        children: true,
        edgesFrom: true,
        edgesTo: true,
      },
    })

    return NextResponse.json(node)
  } catch (error) {
    console.error('Error updating node:', error)
    return NextResponse.json(
      { error: 'Failed to update node' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Delete associated edges first
    await prisma.edge.deleteMany({
      where: {
        OR: [
          { sourceId: params.id },
          { targetId: params.id },
        ],
      },
    })

    // Delete the node
    const node = await prisma.node.delete({
      where: { id: params.id },
    })

    return NextResponse.json(node)
  } catch (error) {
    console.error('Error deleting node:', error)
    return NextResponse.json(
      { error: 'Failed to delete node' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
