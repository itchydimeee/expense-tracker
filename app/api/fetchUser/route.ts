// pages/api/users/[userId].js
import { NextRequest, NextResponse } from 'next/server';
import { createUser, existingUser, readSpecificUser } from '@/lib/users';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' });
    }
    const user = await readSpecificUser(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' });
    }
    return NextResponse.json(user);
  } catch (err) {
    console.log('error', err);
    return NextResponse.json({ error: 'Failed to fetch user' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (await existingUser(body.email)) {
      return NextResponse.json({
        error: 'User with this email already exists',
      });
    }
    const newUser = await createUser(body);
    return NextResponse.json(newUser);
  } catch (err) {
    console.log('error', err);
    return NextResponse.json({ error: 'Failed to create user' });
  }
}

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const { username, email } = await req.json();
    const user = await prisma.users.findUnique({ where: { id: userId ?? '' } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' });
    }
    const updatedUser = await prisma.users.update({
      where: { id: userId ?? '' },
      data: { username, email },
    });
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' });
    }
    return NextResponse.json(updatedUser);
  } catch (err) {
    console.log('error', err);
    return NextResponse.json({ error: 'Failed to update user' });
  }
}
