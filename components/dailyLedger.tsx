import { useState } from 'react'
import { Incomes, Expenses } from '@/lib/types'

import UpdateIncome from './updateIncome'
import UpdateExpense from './updateExpense'

interface Props {
  incomes: { [date: string]: Incomes[] }
  expenses: { [date: string]: Expenses[] }
  incomeTotals: { [date: string]: number }
  expenseTotals: { [date: string]: number }
  currentMonth: number
  currentYear: number
}

const DailyLedger = ({
  incomes,
  expenses,
  incomeTotals,
  expenseTotals,
  currentMonth,
  currentYear,
}: Props) => {
  const [editId, setEditId] = useState<string | null>(null)
  const filteredDates = Object.keys({ ...incomes, ...expenses }).filter(
    (date) => {
      const dateObject = new Date(date)
      return (
        dateObject.getMonth() === currentMonth &&
        dateObject.getFullYear() === currentYear
      )
    }
  )

  const cancelEdit = () => {
    setEditId(null)
  }

  return (
    <>
      <h2 className='text-white font-bold text-2xl pb-2'>Daily Ledger</h2>
      <div>
        {filteredDates
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
          .map((date) => {
            const dateObject = new Date(date)
            const dayOfWeek = dateObject.toLocaleDateString('en-US', {
              weekday: 'long',
            })
            const dayOfMonth = dateObject.getDate()
            const formattedDate = `${dayOfMonth} ${dayOfWeek}`
            return (
              <div
                key={date}
                className='bg-secondary border-none rounded-3xl drop-shadow-lg text-white mb-8'
              >
                <div className='flex flex-row justify-between px-2 py-1 text-sm font-medium text-center'>
                  <h2 className='text-sm text-white font-bold w-1/3'>
                    {formattedDate}
                  </h2>
                  <span className='text-sm text-[#578CF7] font-semibold w-1/3'>
                    {(incomeTotals[date] || 0).toFixed(2)}
                  </span>
                  <span className='text-sm text-[#991B1B] font-semibold w-1/3'>
                    {(expenseTotals[date] || 0).toFixed(2)}
                  </span>
                </div>
                <div className='border-b border-[#4D4D4D] mx-2'></div>
                <div>
                  <ul className='list-none mb-0'>
                    {(incomes[date] || []).map((income) => (
                      <div key={income.id}>
                        {editId === income.id ? (
                          <UpdateIncome
                            income={income}
                            cancelEdit={cancelEdit}
                          />
                        ) : (
                          <>
                            <div
                              className='flex flex-row justify-between px-2 py-1 text-sm font-medium text-center'
                              onClick={() => {
                                if (income.id) {
                                  setEditId(income.id)
                                }
                              }}
                            >
                              <div className='w-1/3 text-sm text-[#A0A0A0]'>
                                {income.category.name}
                              </div>
                              <div className='w-1/3 text-sm truncate text-white'>
                                {income.description.length > 20
                                  ? `${income.description.substring(0, 20)}...`
                                  : income.description}
                              </div>
                              <div className='w-1/3 text-sm text-[#578CF7] font-semibold'>
                                {income.amount}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    {(expenses[date] || []).map((expense) => (
                      <div key={expense.id}>
                        {editId === expense.id ? (
                          <UpdateExpense
                            expense={expense}
                            cancelEdit={cancelEdit}
                          />
                        ) : (
                          <>
                            <div
                              className='flex flex-row justify-between px-2 py-1 text-sm font-medium text-center'
                              onClick={() => {
                                if (expense.id) {
                                  setEditId(expense.id)
                                }
                              }}
                            >
                              <div className='w-1/3 text-sm text-[#A0A0A0]'>
                                {expense.category.name}
                              </div>
                              <div className='w-1/3 text-sm truncate text-white'>
                                {expense.description.length > 20
                                  ? `${expense.description.substring(0, 20)}...`
                                  : expense.description}
                              </div>
                              <div className='w-1/3 text-sm text-[#991B1B] font-semibold'>
                                {expense.amount}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
      </div>
    </>
  )
}

export default DailyLedger
