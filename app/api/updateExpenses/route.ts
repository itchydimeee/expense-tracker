import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json(
        { message: 'expenseId is required' },
        { status: 400 }
      )
    }

    const { id, categoryId, description, amount, date } = body

    const updatedExpense = await prisma.expenses.update({
      where: { id: id },
      data: {
        category: { connect: { id: categoryId } },
        description,
        amount,
        date,
      },
    })
    return NextResponse.json(updatedExpense, { status: 200 })
  } catch (err) {
    console.log('error', err)
    return NextResponse.json(
      { error: 'Failed to update expense' },
      { status: 500 }
    )
  }
}
