/**
 * @jest-environment node
 */
import { DELETE } from '@/app/api/deleteExpenses/route'
import prisma from '@/lib/prisma'

// Mock prisma
jest.mock('../../lib/prisma', () => ({
  __esModule: true,
  default: {
    expenses: {
      delete: jest.fn(),
    },
  },
}))

describe('DELETE /api/deleteExpenses', () => {
  it('should return success message with status 200', async () => {
    const expenseId = 'expense-id-123'
    const requestObj = {
      nextUrl: {
        searchParams: {
          get: () => expenseId,
        },
      },
    } as any

    // Mock the prisma client to return a value
    ;(prisma.expenses.delete as jest.Mock).mockResolvedValue({
      id: expenseId,
    })

    // Call the DELETE function
    const response = await DELETE(requestObj)
    const body = await response.json()

    // Check the response
    expect(response.status).toBe(200)
    expect(body.message).toBe('Expense deleted successfully')
    expect(prisma.expenses.delete).toHaveBeenCalledTimes(1)
  })

  it('should return status 400 when expenseId is missing from request', async () => {
    const requestObj = {
      nextUrl: {
        searchParams: {
          get: () => '',
        },
      },
    } as any

    const response = await DELETE(requestObj)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error).toBe('Expense ID is required')
    expect(prisma.expenses.delete).not.toHaveBeenCalled()
  })

  it('should return status 500 when prisma query rejects', async () => {
    const expenseId = 'expense-id-123'
    const requestObj = {
      nextUrl: {
        searchParams: {
          get: () => expenseId,
        },
      },
    } as any

    // Mock the prisma client to reject the query
    ;(prisma.expenses.delete as jest.Mock).mockRejectedValue(
      new Error('Failed to delete expense')
    )

    const response = await DELETE(requestObj)
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe('Failed to delete expense')
  })
})
