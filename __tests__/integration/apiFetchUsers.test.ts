/**
 * @jest-environment node
 */
import { GET } from '@/app/api/users/route'
import prisma from '@/lib/prisma'

describe('GET from /api/users', () => {
  let createdUserId: string

  const auth0Id = 'auth0-id-123'
  const email = 'user@example.com'
  const username = 'username123'

  beforeAll(async () => {
    const createdUser = await prisma.users.create({
      data: { auth0Id, email, username },
    })

    createdUserId = createdUser.id
  })

  afterAll(async () => {
    await prisma.users.delete({
      where: {
        id: createdUserId,
      },
    })
    await prisma.$disconnect()
  })

  it('should return user data with status 200', async () => {
    const requestObj = {
      nextUrl: {
        searchParams: new URLSearchParams({ auth0Id: auth0Id }),
      },
    } as any

    const response = await GET(requestObj)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.id).toBe(createdUserId)
  })

  it('should return error with status 400 when auth0Id is missing', async () => {
    const requestObj = {
      nextUrl: {
        searchParams: new URLSearchParams({ auth0Id: '' }),
      },
    } as any

    const response = await GET(requestObj)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error).toEqual('auth0Id is required')
  })

  it('should return error with status 404 when user not found', async () => {
    const requestObj = {
      nextUrl: {
        searchParams: new URLSearchParams({ auth0Id: 'non-existent-auth0-id' }),
      },
    } as any

    const response = await GET(requestObj)
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.error).toEqual('User not Found')
  })

  it('should return error with status 500 when database error occurs', async () => {
    const requestObj = {
      nextUrl: {
        searchParams: new URLSearchParams({ auth0Id: auth0Id }),
      },
    } as any

    // Mock prisma.expenses.findUnique to throw an error
    jest.spyOn(prisma.users, 'findUnique').mockImplementation(() => {
      throw new Error('Database error')
    })

    const response = await GET(requestObj)
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toEqual('Failed to fetch user')
  })
})
