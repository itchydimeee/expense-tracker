import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  const { categoryId, description, amount } = await req.json();
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing user ID' });
  }

  try {
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' });
    }

    const category = await prisma.expenseCategories.findUnique({ where: { id: categoryId } });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' });
    }

    const expense = await prisma.expenses.create({
      data: {
        date: new Date(),
        category: { connect: { id: categoryId}},
        description,
        amount: parseFloat(amount),
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create expense' });
  }
}