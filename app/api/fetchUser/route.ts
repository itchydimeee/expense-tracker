import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email') ?? ''

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    const user = await prisma.users.findUnique({ where: { email: email } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    return NextResponse.json({ id: user.id }, { status: 200 })
  } catch (err) {
    console.log('error', err)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}
