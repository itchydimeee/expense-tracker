import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId') ?? ''
    const month = url.searchParams.get('month') ?? ''

    if (!userId || !month) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const dailySummaries = await prisma.dailySummaries.findMany({
      where: {
        userId: userId,
        date: {
          gte: `${month}-01`,
          lt: `${month}-32`, // assuming 31 days in a month
        },
      },
      include: {
        expense: true,
        income: true,
        expenseCategory: true,
        incomeCategory: true,
      },
    })

    return NextResponse.json(dailySummaries)
  } catch (error) {
    console.error('Error fetching daily summaries:', error)
    return NextResponse.json({ error: 'Failed to fetch daily summaries' })
  }
}
