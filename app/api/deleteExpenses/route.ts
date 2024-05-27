import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(req: NextRequest) {
  try {
    const expenseId = req.nextUrl.searchParams.get('expenseId') ?? ''

    if (!expenseId) {
      return NextResponse.json(
        { error: 'Expense ID is required' },
        { status: 400 }
      )
    }

    await prisma.expenses.delete({
      where: {
        id: expenseId,
      },
    })

    return NextResponse.json(
      { message: 'Expense deleted successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.error('Error deleting expense:', err)
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    )
  }
}
