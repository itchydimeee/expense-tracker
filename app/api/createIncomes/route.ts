// pages/api/expenses.js
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.userId) {
      return NextResponse.json(
        { message: 'userId is required' },
        { status: 400 }
      )
    }

    const { userId, date, categoryId, description, amount } = body

    const income = await prisma.income.create({
      data: {
        userId,
        date,
        categoryId,
        description,
        amount,
      },
    })
    return NextResponse.json(income, { status: 201 })
  } catch (err) {
    console.log('error', err)
    return NextResponse.json(
      { error: 'Failed to create income' },
      { status: 500 }
    )
  }
}
