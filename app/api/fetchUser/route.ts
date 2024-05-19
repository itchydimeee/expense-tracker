import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const fetchedEmail = url.searchParams.get('email')
    if (!fetchedEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    const user = await prisma.users.findUnique({
      where: { email: fetchedEmail },
      include: { expenses: true, income: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    return NextResponse.json(user)
  } catch (err) {
    console.log('Error', err)
    return NextResponse.json({ error: 'Failed to fetch user' })
  }
}
