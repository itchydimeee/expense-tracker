import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('id')
    if (!userId) {
      return NextResponse.json(
        { error: 'user id is required' },
        { status: 400 }
      )
    }
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: { expenses: true, income: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not Found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.log('Error fetching user: ', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
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
  } catch (error) {
    console.log('Error creating user: ', error)
    return NextResponse.json({ erroror: 'Failed to create user' })
  }
}
