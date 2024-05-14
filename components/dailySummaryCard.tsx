import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DailySummaryCardProps } from '@/lib/types'

function DailySummaryCard({ date, transactions }: DailySummaryCardProps) {
  const income = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'income') {
      acc += transaction.amount
    }
    return acc
  }, 0)

  const expense = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      acc += transaction.amount
    }
    return acc
  }, 0)

  const total = income - expense

  const formattedDate = new Date(date)
  const dayOfWeek = formattedDate.toLocaleDateString('en-US', {
    weekday: 'long',
  })
  const dayOfMonth = formattedDate.toLocaleDateString('en-US', {
    day: 'numeric',
  })

  return (
    <Card className='bg-secondary border-none rounded-3xl drop-shadow-lg text-white mb-8'>
      <CardHeader className='flex flex-row justify-center py-1'>
        <CardTitle className='font-semibold text-xl'>
          {dayOfWeek}, {dayOfMonth} - ${income}.00 / ${expense}.00 / ${total}.00
        </CardTitle>
      </CardHeader>
      <div className='border-b border-[#4D4D4D] mx-2'></div>
      <CardContent className='flex flex-col pt-1 pb-3 px-6'>
        {transactions
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((transaction, index) => (
            <div
              key={index}
              className='flex flex-row justify-between text-sm font-medium text-center mb-2'
            >
              <div className='w-1/3'>{transaction.category}</div>
              <div className='w-1/3'>{transaction.description}</div>
              <div className='w-1/3 text-right'>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                .00
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  )
}

export default DailySummaryCard
