import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// create income
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, date, categoryId, description, amount } = body
    const income = await prisma.income.create({
      data: {
        user: { connect: { id: userId } },
        date,
        category: { connect: { id: categoryId } },
        description,
        amount,
      },
    })
    return NextResponse.json(income)
  } catch (error) {
    console.error('Error: ', error)
    return NextResponse.json({ error: 'Failed to create income ' })
  }
}

// read income
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId') ?? ''
    const income = await prisma.income.findMany({
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
    return NextResponse.json(income)
  } catch (error) {
    console.error('Error: ', error)
    return NextResponse.json({ error: 'Failed to fetch income' })
  }
}

// update income
export async function PATCH(req: NextRequest) {
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
  } catch (error) {
    console.error('Error: ', error)
    return NextResponse.json({ error: 'Failed to update income' })
  }
}

// delete income
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body
    if (!id) {
      return NextResponse.json(
        { error: 'Income ID is required' },
        { status: 400 }
      )
    }

    await prisma.income.delete({
      where: {
        id: id,
      },
    })

    return NextResponse.json({ message: 'Expense deleted successfully' })
  } catch (error) {
    console.error('Error: ', error)
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    )
  }
}
