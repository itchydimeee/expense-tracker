// pages/api/expenses/[userId].js
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId') ?? ''
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
    return NextResponse.json(incomes)
  } catch (err) {
    console.log('Error: ', err)
    return NextResponse.json({ error: 'Failed to fetch income' })
  }
}
