/**
 * @jest-environment node
 */
import { POST } from '@/app/api/users/route'
import prisma from '@/lib/prisma'

// Mock prisma
// We want to ensure we're mocking the prisma client for this test
// so we don't actually make a call to the database
jest.mock('../../lib/prisma', () => ({
  __esModule: true,
  default: {
    users: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}))

describe('POST from /api/users', () => {
  const auth0Id = 'new-auth0-id'
  const email = 'new-user@example.com'
  const username = 'new-username'

  beforeEach(() => {
    jest.resetAllMocks()
    jest.doMock('../../lib/prisma', () => ({
      __esModule: true,
      default: {
        users: {
          create: jest.fn(),
          findUnique: jest.fn(),
        },
      },
    }))
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should create a new user with status 200', async () => {
    const requestObj = {
      json: async () => ({
        auth0Id: auth0Id,
        email: email,
        username: username,
      }),
    } as any

    // Mock the prisma client to return a value
    ;(prisma.users.create as jest.Mock).mockResolvedValue({
      auth0Id,
      email,
      username,
    })

    const response = await POST(requestObj)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.auth0Id).toBe('new-auth0-id')
  })

  it('should return error with status 409 when email already exists', async () => {
    const requestObj = {
      json: async () => ({
        auth0Id: auth0Id,
        email: 'markrenzotan@example.com', // existing email
        username: username,
      }),
    } as any

    // Mock the prisma client to return a value
    ;(prisma.users.findUnique as jest.Mock).mockResolvedValue({
      where: { email: 'markrenzotan@example.com' },
    })

    const response = await POST(requestObj)
    const body = await response.json()

    expect(response.status).toBe(409)
    expect(body.error).toEqual('User with this email already exists')
  })

  it('should return error with status 500 for database errors', async () => {
    const requestObj = {
      json: async () => ({
        auth0Id: auth0Id,
        email: email,
        username: username,
      }),
    } as any

    // Mock the prisma client to reject the query with an unhandled error
    ;(prisma.users.create as jest.Mock).mockRejectedValue(
      new Error('Failed to create user')
    )

    const response = await POST(requestObj)
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toEqual('Failed to create user')
  })
})
