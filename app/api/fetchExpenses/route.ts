// pages/api/expenses/[userId].js
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { error } from 'console'

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId') ?? ''

    if (!userId) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    const expenses = await prisma.expenses.findMany({
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
    return NextResponse.json(expenses, { status: 200 })
  } catch (err) {
    console.log('error', err)
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 404 }
    )
  }
}
