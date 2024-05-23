import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
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
    return NextResponse.json(updatedExpense)
  } catch (err) {
    console.log('error', err)
    return NextResponse.json({ error: 'Failed to update expense' })
  }
}
