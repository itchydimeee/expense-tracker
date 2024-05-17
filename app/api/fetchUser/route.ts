import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { URL } from 'url'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const email = url.searchParams.get('email')
    if (!email) {
      return NextResponse.json({ error: 'Email is required' })
    }
    const user = await prisma.users.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' })
    }
    return NextResponse.json({ id: user.id })
  } catch (err) {
    console.log('error', err)
    return NextResponse.json({ error: 'Failed to fetch user' })
  }
}
