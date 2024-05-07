import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.expenseCategories.findMany();
    return NextResponse.json(categories);
  } catch (err) {
    console.log('error', err);
    return NextResponse.json({ error: 'Failed to fetch categories' });
  }
}