/**
 * @jest-environment node
 */
import { GET } from '@/app/api/fetchIncomes/route'
import prisma from '@/lib/prisma'

describe('GET from /api/fetchIncomes', () => {
  let createdIncomeId: string

  const userId = 'clvoy81ge000018anon6tdud9'
  const date = new Date('2024-05-27')
  const categoryId = '1'
  const description = 'test income description'
  const amount = 10.99

  beforeAll(async () => {
    const createdIncome = await prisma.income.create({
      data: {
        userId: userId,
        date: date,
        categoryId: categoryId,
        description: description,
        amount: amount,
      },
    })

    createdIncomeId = createdIncome.id
  })

  afterAll(async () => {
    await prisma.income.delete({
      where: {
        id: createdIncomeId,
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
    jest.spyOn(prisma.income, 'findMany').mockImplementation(() => {
      throw new Error('Database error')
    })

    const response = await GET(requestObj)
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.error).toEqual('Failed to fetch incomes')
  })
})
