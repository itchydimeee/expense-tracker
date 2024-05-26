import { NextApiRequest, NextApiResponse } from 'next'
import { POST } from '@/app/api/createExpenses/route'
import prisma from '@/lib/prisma'

describe('API Route', () => {
  let expenseId: string

  afterEach(async () => {
    if (expenseId) {
      await prisma.expenses.delete({ where: { id: expenseId } })
    }
  })

  it('should create an expense', async () => {
    const expense = await prisma.expenses.create({
      data: {
        userId: '123',
        date: '2023-03-01',
        categoryId: '1',
        description: 'Test expense',
        amount: 10.99,
      },
    })
  })

  it('should return an error if the request body is invalid', async () => {
    // Test implementation
  })
})
