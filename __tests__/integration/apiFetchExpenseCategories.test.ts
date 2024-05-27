/**
 * @jest-environment node
 */
import { GET } from '@/app/api/fetchExpenseCategories/route'
import prisma from '@/lib/prisma'

describe('GET from /api/fetchExpenseCategories', () => {
  it('should return data with status 200', async () => {
    const response = await GET()

    expect(response.status).toBe(200)
  })

  it('should return error with status 500 when database error occurs', async () => {
    jest.spyOn(prisma.expenseCategories, 'findMany').mockImplementation(() => {
      throw new Error('Database error')
    })

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toEqual('Failed to fetch categories')
  })
})
