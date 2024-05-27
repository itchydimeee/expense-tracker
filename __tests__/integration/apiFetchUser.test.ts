/**
 * @jest-environment node
 */
import { GET } from '@/app/api/fetchUser/route'
import prisma from '@/lib/prisma'

describe('GET from /api/fetchUser', () => {
  let userId: string

  const auth0Id = 'auth0-id-1'
  const email = 'user@example.com'
  const username = 'username-1'

  beforeAll(async () => {
    const user = await prisma.users.create({
      data: {
        auth0Id: auth0Id,
        email: email,
        username: username,
      },
    })
    userId = user.id
  })

  afterAll(async () => {
    await prisma.users.delete({
      where: {
        id: userId,
      },
    })
    await prisma.$disconnect()
  })

  it('should return user id with status 200', async () => {
    const requestObj = {
      nextUrl: {
        searchParams: new URLSearchParams({ email: email }),
      },
    } as any

    const response = await GET(requestObj)
    const body = await response.json()

    expect(response.status).toBe(200)
  })

  it('should return error with status 400 when email is not provided', async () => {
    const requestObj = {
      nextUrl: {
        searchParams: new URLSearchParams({}),
      },
    } as any

    const response = await GET(requestObj)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error).toBe('Email is required')
  })

  it('should return error with status 404 when user not found', async () => {
    const email = 'user-not-found@example.com'

    const requestObj = {
      nextUrl: {
        searchParams: new URLSearchParams({ email: email }),
      },
    } as any

    const response = await GET(requestObj)
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.error).toBe('User not found')
  })

  it('should return error with status 500 when database error occurs', async () => {
    const requestObj = {
      nextUrl: {
        searchParams: new URLSearchParams({ email: email }),
      },
    } as any

    // Mock prisma.users.findUnique to throw an error
    jest.spyOn(prisma.users, 'findUnique').mockImplementation(() => {
      throw new Error('Database error')
    })

    const response = await GET(requestObj)
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe('Failed to fetch user')
  })
})
