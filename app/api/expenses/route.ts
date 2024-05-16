import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// create expense
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, date, categoryId, description, amount } = body
    const expense = await prisma.expenses.create({
      data: {
        user: { connect: { id: userId } },
        date,
        category: { connect: { id: categoryId } },
        description,
        amount,
      },
    })
    return NextResponse.json(expense)
  } catch (error) {
    console.error('Error: ', error)
    return NextResponse.json({ error: 'Failed to create expense' })
  }
}

// read expenses
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId') ?? ''
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
    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Error: ', error)
    return NextResponse.json({ error: 'Failed to fetch expenses' })
  }
}

// update expense
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, categoryId, description, amount } = body
    const updatedExpense = await prisma.expenses.update({
      where: { id: id },
      data: {
        category: { connect: { id: categoryId } },
        description,
        amount,
      },
    })
    return NextResponse.json(updatedExpense)
  } catch (error) {
    console.error('Error: ', error)
    return NextResponse.json({ error: 'Failed to update expense' })
  }
}

// delete expense
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body
    if (!id) {
      return NextResponse.json(
        { error: 'Expense ID is required' },
        { status: 400 }
      )
    }

    await prisma.expenses.delete({
      where: { id: id },
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
