'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useUser } from '@auth0/nextjs-auth0/client'

import { Expense, Income } from '@/lib/types'

import Navbar from '@/components/navbar'
import DailyLedger from '@/components/dailyLedger'
import CreateTransactionCard from '@/components/createTransactionCard'
import Footer from '@/components/footer'
import CreateUser from '@/components/createUser'

const HomePage = () => {
  const { user, error, isLoading } = useUser()
  const isLoggedIn = user !== undefined && user !== null
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserId = async () => {
      if (isLoggedIn) {
        try {
          const fetchUser = await axios.get('/api/users', {
            params: {
              auth0Id: user.sub,
            },
          })
          const userId = fetchUser.data.id
          setUserId(userId)
        } catch (error) {}
      }
    }
    fetchUserId()
  }, [isLoggedIn, user])

  console.log('UserID: ', userId)

  const handleCreateExpense = async (expense: Expense) => {
    console.log('Creating Expense: ', expense)
    if (!expense) {
      console.error('No expense data available')
      return
    }

    try {
      await axios.post('/api/createExpenses', expense)
      window.location.reload()
    } catch (error: any) {
      console.error(error.message)
    }
    console.log('Expense successfully created: ', expense)
  }

  const handleCreateIncome = async (income: Income) => {
    console.log('Creating Income: ', income)
    if (!income) {
      console.error('No income data available')
      return
    }

    try {
      await axios.post('/api/createIncomes', income)
      window.location.reload()
    } catch (error: any) {
      console.error(error.message)
    }
    console.log('Income successfully created: ', income)
  }

  if (isLoading)
    return (
      <div className='flex justify-center items-center h-screen text-white'>
        Loading user details...
      </div>
    )
  if (error) return <div>{error.message}</div>

  return (
    <div id='home-page' className='flex flex-col min-h-screen bg-background'>
      <div className='flex-1 md:p-6 lg:p-12 pt-10'>
        <Navbar />
        <div
          className='mt-10 mb-10 px-4'
          id='daily-ledger'
          data-user-id={userId}
        >
          <DailyLedger userId={userId} />
        </div>
        <div className='flex justify-center'>
          <div className='fixed bottom-[15px] z-10 '>
            <CreateTransactionCard
              userId={userId}
              onSubmitExpense={handleCreateExpense}
              onSubmitIncome={handleCreateIncome}
            />
          </div>
          <CreateUser />
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default HomePage
