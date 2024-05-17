import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')
    const user = await prisma.users.findUnique({
      where: { auth0Id: userId ?? '' },
      include: { expenses: true, dailySummaries: true },
    })
    if (!user) {
      return NextResponse.json({ error: 'User not Found' })
    }
    return NextResponse.json({ id: user.id })
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
