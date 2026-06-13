import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const FALLBACK_STATS = [
  { statName: 'Total Generation Capacity', value: 22700, unit: 'MW' },
  { statName: 'System Efficiency', value: 87.5, unit: '%' },
  { statName: 'Total Distribution Capacity', value: 9800, unit: 'MW' },
  { statName: 'Peak Demand', value: 14800, unit: 'MW' },
  { statName: 'Renewable Energy', value: 370, unit: 'MW' },
];

export async function GET() {
  if (process.env.VERCEL) {
    return NextResponse.json(FALLBACK_STATS)
  }

  try {
    const stats = await prisma.dashboardStat.findMany()

    if (stats.length === 0) {
      return NextResponse.json(FALLBACK_STATS)
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(FALLBACK_STATS)
  }
}
