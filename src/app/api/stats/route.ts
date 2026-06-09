import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const stats = await prisma.dashboardStat.findMany()

    if (stats.length === 0) {
      // Return default stats if none exist
      return NextResponse.json([
        {
          statName: 'Total Generation Capacity',
          value: 22700,
          unit: 'MW',
          isManualOverride: false,
        },
        {
          statName: 'System Efficiency',
          value: 87.5,
          unit: '%',
          isManualOverride: false,
        },
        {
          statName: 'Total Distribution Capacity',
          value: 9800,
          unit: 'MW',
          isManualOverride: false,
        },
        {
          statName: 'Peak Demand',
          value: 14800,
          unit: 'MW',
          isManualOverride: false,
        },
        {
          statName: 'Renewable Energy',
          value: 370,
          unit: 'MW',
          isManualOverride: false,
        },
      ])
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    // Return default stats on error
    return NextResponse.json([
      { statName: 'Total Generation Capacity', value: 22700, unit: 'MW' },
      { statName: 'System Efficiency', value: 87.5, unit: '%' },
      { statName: 'Total Distribution Capacity', value: 9800, unit: 'MW' },
      { statName: 'Peak Demand', value: 14800, unit: 'MW' },
      { statName: 'Renewable Energy', value: 370, unit: 'MW' },
    ])
  }
}
