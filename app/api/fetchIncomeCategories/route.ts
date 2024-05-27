import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.incomeCategories.findMany()
    return NextResponse.json(categories, { status: 200 })
  } catch (err) {
    console.log('error', err)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
