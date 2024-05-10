// pages/api/expenses.js
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, date, categoryId, description, amount } = body;
    const expense = await prisma.income.create({
      data: {
        user: { connect: { id: userId } },
        date,
        category: { connect: { id: categoryId } },
        description,
        amount,
      },
    });
    return NextResponse.json(expense);
  } catch (err) {
    console.log('error', err);
    return NextResponse.json({ error: 'Failed to create expense' });
  }
}