import React, { useState } from 'react'
import UpdateIncome from './updateIncome'
import UpdateExpense from './updateExpense'
import { DailySummaryCardProps } from '@/lib/types'

const DailySummaryCard: React.FC<DailySummaryCardProps> = ({
  filteredDates,
  incomes,
  expenses,
  incomeTotals,
  expenseTotals,
}) => {
  const [editId, setEditId] = useState<string | null>(null)
  const cancelEdit = () => {
    setEditId(null)
  }

  return (
    <div className='max-w-md p-2'>
      {filteredDates
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        .map((date) => {
          const dateObject = new Date(date)
          const dayOfWeek = dateObject.toLocaleDateString('en-US', {
            weekday: 'short',
          })
          const dayOfMonth = dateObject.getDate()
          return (
            <div key={date} className='mb-4 bg-secondary rounded-3xl p-2 '>
              <div className='flex justify-between'>
                <div className='flex px-2'>
                  <h2 className='text-lg text-white font-bold px-1 '>
                    {dayOfMonth}
                  </h2>
                  <h2 className='text-xs font-bold text-white px-1 py-1 bg-background rounded-md my-1'>
                    {dayOfWeek}
                  </h2>
                </div>
                <div className='flex justify-end mr-2 pt-1'>
                  <span className='text-sm text-income w-20 text-right font-semibold'>
                    {(incomeTotals[date] || 0).toFixed(2)}
                  </span>
                  <span className='text-sm text-expense w-20 text-right font-semibold'>
                    {(expenseTotals[date] || 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <div  className='border-t border-[#4D4D4D]' id="expense-item"></div>
              <div className='px-2 py-1 rounded'>
                <ul className='list-none'>
                  {(incomes[date] || []).map((income) => (
                    <li key={income.id} className='py-1' id="income-list">
                      {editId === income.id ? (
                        <UpdateIncome income={income} cancelEdit={cancelEdit} />
                      ) : (
                        <>
                          <div
                            id="list-item"
                            className='flex w-full cursor-pointer'
                            onClick={() => {
                              if (income.id) {
                                setEditId(income.id)
                              }
                            }}
                          >
                            <span id="income-category" className='w-1/3 text-sm text-[#A0A0A0]'>
                              {income.category.name}
                            </span>
                            <span id="income-description" className='w-1/3 text-sm truncate text-white text-center'>
                              {income.description.length > 20
                                ? `${income.description.substring(0, 20)}...`
                                : income.description}
                            </span>
                            <span id="income-amount" className='w-1/3 text-sm text-income text-right'>
                              {Number(income.amount).toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                  {(expenses[date] || []).map((expense) => (
                    <li key={expense.id} className='py-1' id="expense-list">
                      {editId === expense.id ? (
                        <UpdateExpense
                          expense={expense}
                          cancelEdit={cancelEdit}
                        />
                      ) : (
                        <>
                          <div
                            id="list-item"
                            className='flex w-full cursor-pointer'
                            onClick={() => {
                              if (expense.id) {
                                setEditId(expense.id)
                              }
                            }}
                          >
                            <span id="expense-category" className='w-1/3 text-sm text-[#A0A0A0]'>
                              {expense.category.name}
                            </span>
                            <span id="expense-description" className='w-1/3 text-sm truncate text-white text-center'>
                              {expense.description.length > 20
                                ? `${expense.description.substring(0, 20)}...`
                                : expense.description}
                            </span>
                            <span id="expense-amount" className='w-1/3 text-sm text-expense text-right'>
                              {Number(expense.amount).toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default DailySummaryCard
