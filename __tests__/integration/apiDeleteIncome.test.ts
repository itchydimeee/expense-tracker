/**
 * @jest-environment node
 */
import { DELETE } from '@/app/api/deleteIncome/route'
import prisma from '@/lib/prisma'

// Mock prisma
jest.mock('../../lib/prisma', () => ({
  __esModule: true,
  default: {
    income: {
      delete: jest.fn(),
    },
  },
}))

describe('DELETE /api/deleteIncome', () => {
  it('should return success message with status 200', async () => {
    const incomeId = 'income-id-123'
    const requestObj = {
      nextUrl: {
        searchParams: {
          get: () => incomeId,
        },
      },
    } as any

    // Mock the prisma client to return a value
    ;(prisma.income.delete as jest.Mock).mockResolvedValue({
      id: incomeId,
    })

    // Call the DELETE function
    const response = await DELETE(requestObj)
    const body = await response.json()

    // Check the response
    expect(response.status).toBe(200)
    expect(body.message).toBe('Income deleted successfully')
    expect(prisma.income.delete).toHaveBeenCalledTimes(1)
  })

  it('should return status 400 when incomeId is missing from request', async () => {
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
    expect(body.error).toBe('Income ID is required')
    expect(prisma.income.delete).not.toHaveBeenCalled()
  })

  it('should return status 500 when prisma query rejects', async () => {
    const incomeId = 'income-id-123'
    const requestObj = {
      nextUrl: {
        searchParams: {
          get: () => incomeId,
        },
      },
    } as any

    // Mock the prisma client to reject the query
    ;(prisma.income.delete as jest.Mock).mockRejectedValue(
      new Error('Failed to delete expense')
    )

    const response = await DELETE(requestObj)
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe('Failed to delete income')
  })
})
