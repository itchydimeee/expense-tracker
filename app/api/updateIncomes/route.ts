import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, categoryId, description, amount } = body
    const updatedIncome = await prisma.income.update({
      where: { id: id },
      data: {
        category: { connect: { id: categoryId } },
        description,
        amount,
      },
    })
    return NextResponse.json(updatedIncome)
  } catch (err) {
    console.log('error', err)
    return NextResponse.json({ error: 'Failed to update income' })
  }
}
