import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId') ?? ''

    if (!userId) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    const incomes = await prisma.income.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
    })
    return NextResponse.json(incomes, { status: 200 })
  } catch (err) {
    console.log('error', err)
    return NextResponse.json(
      { error: 'Failed to fetch incomes' },
      { status: 404 }
    )
  }
}
