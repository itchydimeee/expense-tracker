/**
 * @jest-environment node
 */
import { PUT } from '@/app/api/updateExpenses/route'
import prisma from '@/lib/prisma'

// Mock prisma
// We want to ensure we're mocking the prisma client for this test
// so we don't actually make a call to the database
jest.mock('../../lib/prisma', () => ({
  __esModule: true,
  default: {
    expenses: {
      update: jest.fn(),
    },
  },
}))

describe('PUT /api/updateExpenses', () => {
  const id = 'expense-id-1'
  const categoryId = '1'
  const description = 'updated expense description'
  const amount = 20.99
  const date = new Date('2024-05-28')

  it('should return added data with status 200', async () => {
    const requestObj = {
      json: async () => ({
        id,
        categoryId,
        description,
        amount,
        date,
      }),
    } as any

    // Mock the prisma client to return a value
    ;(prisma.expenses.update as jest.Mock).mockResolvedValue({
      where: { id: id },
      data: {
        category: { connect: { id: categoryId } },
        description,
        amount,
        date,
      },
    })

    // Call the PUT function
    const response = await PUT(requestObj)
    const body = await response.json()

    // Check the response
    expect(response.status).toBe(200)
    expect(prisma.expenses.update).toHaveBeenCalledTimes(1)
  })

  it('should return status 400 when expenseId is missing from request body', async () => {
    const requestObj = {
      json: async () => ({
        id: '',
        categoryId,
        description,
        amount,
        date,
      }),
    } as any

    ;(prisma.expenses.update as jest.Mock).mockResolvedValue({
      where: { id: '' },
      data: {
        category: { connect: { id: categoryId } },
        description,
        amount,
        date,
      },
    })

    const response = await PUT(requestObj)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.message).toEqual('expenseId is required')
    expect(prisma.expenses.update).not.toHaveBeenCalled()
  })

  it('should return status 500 when prisma query rejects', async () => {
    const requestObj = {
      json: async () => ({
        id,
        categoryId,
        description,
        amount,
        date,
      }),
    } as any

    // Mock the prisma client to reject the query
    ;(prisma.expenses.update as jest.Mock).mockRejectedValue(
      new Error('Failed to update expense')
    )

    const response = await PUT(requestObj)
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toEqual('Failed to update expense')
  })
})
