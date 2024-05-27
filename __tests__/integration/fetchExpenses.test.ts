/**
 * @jest-environment node
 */
import { GET } from '@/app/api/fetchExpenses/route'
import prisma from '@/lib/prisma'

describe('GET from /api/fetchExpenses', () => {
  let createdExpenseId: string

  const userId = 'clvoy81ge000018anon6tdud9'
  const date = new Date('2024-05-27')
  const categoryId = '1'
  const description = 'test expense description'
  const amount = 10.99

  beforeAll(async () => {
    const createdExpense = await prisma.expenses.create({
      data: {
        userId: userId,
        date: date,
        categoryId: categoryId,
        description: description,
        amount: amount,
      },
    })

    createdExpenseId = createdExpense.id
  })

  afterAll(async () => {
    await prisma.expenses.delete({
      where: {
        id: createdExpenseId,
      },
    })
    await prisma.$disconnect()
  })

  it('should return data with status 200', async () => {
    const requestObj = {
      nextUrl: {
        searchParams: new URLSearchParams({ userId: userId }),
      },
    } as any

    const response = await GET(requestObj)
    const body = await response.json()

    expect(response.status).toBe(200)
  })

  it('should return error with status 400 when userId not found', async () => {
    const requestObj = {
      nextUrl: {
        searchParams: new URLSearchParams({ userId: '' }),
      },
    } as any

    const response = await GET(requestObj)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error).toEqual('Invalid user ID')
  })

  it('should return error with status 404 when database error occurs', async () => {
    const requestObj = {
      nextUrl: {
        searchParams: new URLSearchParams({ userId: userId }),
      },
    } as any

    // Mock prisma.expenses.findMany to throw an error
    jest.spyOn(prisma.expenses, 'findMany').mockImplementation(() => {
      throw new Error('Database error')
    })

    const response = await GET(requestObj)
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.error).toEqual('Failed to fetch expenses')
  })
})
