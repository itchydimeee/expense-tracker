import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(req: NextRequest) {
  try {
    const incomeId = req.nextUrl.searchParams.get('incomeId') ?? ''

    if (!incomeId) {
      return NextResponse.json(
        { error: 'Income ID is required' },
        { status: 400 }
      )
    }

    await prisma.income.delete({
      where: {
        id: incomeId,
      },
    })

    return NextResponse.json(
      { message: 'Income deleted successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.error('Error deleting income:', err)
    return NextResponse.json(
      { error: 'Failed to delete income' },
      { status: 500 }
    )
  }
}
