// pages/api/users/[userId].js
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const auth0Id = req.nextUrl.searchParams.get('auth0Id') ?? ''

    if (!auth0Id) {
      return NextResponse.json(
        { error: 'auth0Id is required' },
        { status: 400 }
      )
    }

    const user = await prisma.users.findUnique({
      where: { auth0Id: auth0Id },
      include: { expenses: true, income: true },
    })
    if (!user) {
      return NextResponse.json({ error: 'User not Found' })
    }
    return NextResponse.json({ id: user.id }, { status: 200 })
  } catch (err) {
    console.log('error', err)
    return NextResponse.json({ error: 'Failed to fetch user' })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (await prisma.users.findUnique({ where: { email: body.email } })) {
      return NextResponse.json({
        error: 'User with this email already exists',
      })
    }
    const { auth0Id, email, username } = body
    const newUser = await prisma.users.create({
      data: { auth0Id, email, username },
    })
    return NextResponse.json(newUser)
  } catch (err) {
    console.log('error', err)
    return NextResponse.json({ error: 'Failed to create user' })
  }
}
