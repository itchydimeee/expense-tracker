'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Incomes, Expenses, monthsArray } from '@/lib/types'
import UpdateExpense from './updateExpense'
import UpdateIncome from './updateIncome'
import { combineTransactions, calculateTotals } from '@/lib/transactions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import MonthlySummaryCard from './monthlySummaryCard'

function DailyLedger() {
  const [incomes, setIncomes] = useState<{ [date: string]: Incomes[] }>({})
  const [expenses, setExpenses] = useState<{ [date: string]: Expenses[] }>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, isLoading } = useUser()
  const [editId, setEditId] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  )
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  )

  useEffect(() => {
    if (user) {
      fetchTransactions()
    }
  }, [user])

  function cancelEdit() {
    setEditId(null)
  }

  const fetchTransactions = async () => {
    setLoading(true)
    setError(null)
    if (user) {
      try {
        const fetchUser = await axios.get('/api/fetchUser', {
          params: {
            email: user.email,
          },
        })
        const userId = fetchUser.data.id
        const incomeResponse = await axios.get(`/api/fetchIncomes`, {
          params: {
            userId: userId,
          },
        })
        const expenseResponse = await axios.get(`/api/fetchExpenses`, {
          params: {
            userId: userId,
          },
        })
        const incomeData = incomeResponse.data
        const expenseData = expenseResponse.data
        const combinedTransactions = combineTransactions(
          incomeData,
          expenseData
        )
        setIncomes(combinedTransactions.incomes)
        setExpenses(combinedTransactions.expenses)
      } catch (error) {
        console.error(error)
        setError('Failed to fetch transactions')
      } finally {
        setLoading(false)
      }
    }
  }

  const {
    incomeTotals,
    expenseTotals,
    monthlyIncomeTotals,
    monthlyExpenseTotals,
    monthlyProfitTotals,
  } = calculateTotals(incomes, expenses)

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div
          className='spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full'
          role='status'
        >
          <span className='sr-only'>Loading...</span>
        </div>
        <p className='text-lg text-gray-600 px-2'>Loading...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div
          className='spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full'
          role='status'
        >
          <span className='sr-only'>Loading transactions...</span>
        </div>
        <p className='text-lg text-gray-600 px-2'>Loading transactions...</p>
      </div>
    )
  }

  const combinedTransactions = { ...incomes, ...expenses }

  const filteredDates = Object.keys(combinedTransactions).filter((date) => {
    const dateObject = new Date(date)
    return (
      dateObject.getMonth() === currentMonth &&
      dateObject.getFullYear() === currentYear
    )
  })

  return (
    <div className='max-w-md mx-auto p-2 pt-6 pb-8'>
      <h2 className='text-lg text-center text-white mb-2'>
        <MonthlySummaryCard
          currentMonth={currentMonth}
          currentYear={currentYear}
          monthlyIncomeTotals={monthlyIncomeTotals}
          monthlyExpenseTotals={monthlyExpenseTotals}
          monthlyProfitTotals={monthlyProfitTotals}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
        />
      </h2>
      <h1 className='text-2xl font-bold mb-2 mt-6 text-white'>Daily Ledger</h1>
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>
          <p>{error}</p>
        </div>
      )}
      {filteredDates
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        .map((date) => {
          const dateObject = new Date(date)
          const dayOfWeek = dateObject.toLocaleDateString('en-US', {
            weekday: 'short',
          })
          const dayOfMonth = dateObject.getDate()
          return (
            <div key={date} className='mb-4 bg-secondary rounded-3xl p-2'>
              <div className='flex justify-between '>
                <div className='flex px-1'>
                  <h2 className='text-lg text-white font-bold px-1 '>
                    {dayOfMonth}
                  </h2>
                  <h2 className='text-xs font-bold text-white px-1 py-1 bg-background rounded-md mb-1 mt-1'>
                    {dayOfWeek}
                  </h2>
                </div>
                <div className='flex justify-end'>
                  <span className='text-sm text-[#578CF7] font-semibold w-20 text-right pt-1'>
                    {(incomeTotals[date] || 0).toFixed(2)}
                  </span>
                  <span className='text-sm text-[#991B1B] font-semibold w-20 text-right ml-2 pt-1'>
                    {(expenseTotals[date] || 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className='border-t border-[#4D4D4D]'></div>
              <div className='p-4 rounded'>
                <ul className='list-none'>
                  {(incomes[date] || []).map((income) => (
                    <li key={income.id} className='flex justify-between'>
                      {editId === income.id ? (
                        <UpdateIncome income={income} cancelEdit={cancelEdit} />
                      ) : (
                        <>
                          <div
                            className='flex justify-between w-full cursor-pointer'
                            onClick={() => {
                              if (income.id) {
                                setEditId(income.id)
                              }
                            }}
                          >
                            <span className='text-sm text-[#A0A0A0]'>
                              {income.category.name}
                            </span>
                            <span className='text-sm truncate text-white'>
                              {income.description.length > 20
                                ? `${income.description.substring(0, 20)}...`
                                : income.description}
                            </span>
                            <span className='text-sm text-right text-[#578CF7]'>
                              {Number(income.amount).toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                  {(expenses[date] || []).map((expense) => (
                    <li key={expense.id} className='flex justify-between py-2'>
                      {editId === expense.id ? (
                        <UpdateExpense
                          expense={expense}
                          cancelEdit={cancelEdit}
                        />
                      ) : (
                        <>
                          <div
                            className='flex justify-between w-full cursor-pointer'
                            onClick={() => {
                              if (expense.id) {
                                setEditId(expense.id)
                              }
                            }}
                          >
                            <span className='text-sm text-[#A0A0A0]'>
                              {expense.category.name}
                            </span>
                            <span className='text-sm truncate text-white'>
                              {expense.description.length > 20
                                ? `${expense.description.substring(0, 20)}...`
                                : expense.description}
                            </span>
                            <span className='text-sm text-right text-[#991B1B]'>
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

export default DailyLedger
