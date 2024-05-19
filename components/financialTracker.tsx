'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Expenses, Incomes } from '@/lib/types'
import { combineTransactions, calculateTotals } from '@/lib/transactions'
import { LoadingIndicatorProps } from '@/lib/types'

import MonthlySummaryCard from './monthlySummaryCard'
import DailyLedger from './dailyLedger'

function FinancialTracker() {
  const { user, isLoading } = useUser()
  const [incomes, setIncomes] = useState<{ [date: string]: Incomes[] }>({})
  const [expenses, setExpenses] = useState<{ [date: string]: Expenses[] }>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  const fetchTransactions = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { data: userData } = await axios.get('/api/fetchUser', {
        params: {
          email: user.email,
        },
      })

      const userId = userData.id

      const { data: incomeData } = await axios.get('/api/fetchIncomes', {
        params: {
          userId: userId,
        },
      })
      const { data: expenseData } = await axios.get('/api/fetchExpenses', {
        params: {
          userId: userId,
        },
      })

      const combinedTransactions = combineTransactions(incomeData, expenseData)
      setIncomes(combinedTransactions.incomes)
      setExpenses(combinedTransactions.expenses)
    } catch (error) {
      console.error('Error fetching transactions: ', error)
      setError('Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }

  const { incomeTotals, expenseTotals } = calculateTotals(incomes, expenses)

  const LoadingIndicator = ({ message }: LoadingIndicatorProps) => (
    <div className='flex justify-center items-center h-screen'>
      <div
        className='px-2 spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full'
        role='status'
      >
        <span className='sr-only'>{message}</span>
      </div>
      <p className='px-2 text-lg text-gray-600'>{message}</p>
    </div>
  )

  if (isLoading) {
    return <LoadingIndicator message='Loading...' />
  }

  if (loading) {
    return <LoadingIndicator message='Loading transactions...' />
  }

  const combinedTransactions = { ...incomes, ...expenses }

  const filteredDates = Object.keys(combinedTransactions).filter((date) => {
    const dateObject = new Date(date)
    return (
      dateObject.getMonth() === currentMonth &&
      dateObject.getFullYear() === currentYear
    )
  })

  const handlePreviousMonthChange = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonthChange = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  return (
    <div className='max-w-md mx-auto p-4 pt-6 pb-8'>
      <MonthlySummaryCard
        currentMonth={currentMonth}
        currentYear={currentYear}
        incomeTotals={incomeTotals}
        expenseTotals={expenseTotals}
        onPreviousMonth={handlePreviousMonthChange}
        onNextMonth={handleNextMonthChange}
      />
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>
          <p>{error}</p>
        </div>
      )}
      <DailyLedger
        incomes={incomes}
        expenses={expenses}
        incomeTotals={incomeTotals}
        expenseTotals={expenseTotals}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />
    </div>
  )
}

export default FinancialTracker
