/**
 * @jest-environment node
 */
import { POST } from '@/app/api/createIncomes/route'
import prisma from '@/lib/prisma'

// Mock prisma
// We want to ensure we're mocking the prisma client for this test
// so we don't actually make a call to the database
jest.mock('../../lib/prisma', () => ({
  __esModule: true,
  default: {
    income: {
      create: jest.fn(),
    },
  },
}))

describe('POST /api/createIncomes', () => {
  const userId = 'clvoy81ge000018anon6tdud9'
  const date = new Date('2024-05-27')
  const categoryId = '1'
  const description = 'test income description'
  const amount = 10.99

  it('should return added data with status 201', async () => {
    const requestObj = {
      json: async () => ({
        userId: userId,
        date: date,
        categoryId: categoryId,
        description: description,
        amount: amount,
      }),
    } as any

    // Mock the prisma client to return a value
    ;(prisma.income.create as jest.Mock).mockResolvedValue({
      userId: userId,
      date: date,
      categoryId: categoryId,
      description: description,
      amount: amount,
    })

    // Call the POST function
    const response = await POST(requestObj)
    const body = await response.json()

    // Check the response
    expect(response.status).toBe(201)
    expect(body.userId).toBe(userId)
    expect(prisma.income.create).toHaveBeenCalledTimes(1)
  })

  it('should return status 400 when userId is missing from request body', async () => {
    const requestObj = {
      json: async () => ({
        userId: '',
        date: date,
        categoryId: categoryId,
        description: description,
        amount: amount,
      }),
    } as any

    ;(prisma.income.create as jest.Mock).mockResolvedValue({
      userId: '',
      date: date,
      categoryId: categoryId,
      description: description,
      amount: amount,
    })

    const response = await POST(requestObj)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.message).toEqual(expect.any(String))
    expect(prisma.income.create).not.toHaveBeenCalled()
  })

  it('should return status 500 when prisma query rejects', async () => {
    const requestObj = {
      json: async () => ({
        userId: userId,
        date: date,
        categoryId: categoryId,
        description: description,
        amount: amount,
      }),
    } as any

    // Mock the prisma client to reject the query
    ;(prisma.income.create as jest.Mock).mockRejectedValue(
      new Error('Failed to create income')
    )

    const response = await POST(requestObj)
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toEqual('Failed to create income')
  })
})
