'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

import { Expense, Income } from '@/lib/types'

import DailyLedger from '@/components/dailyLedger'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { useUser } from '@auth0/nextjs-auth0/client'

const HomePage = () => {
  const { user, error, isLoading } = useUser()
  const isLoggedIn = user !== undefined && user !== null
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserId = async () => {
      if (isLoggedIn) {
        try {
          const fetchUser = await axios.get('/api/fetchUser', {
            params: {
              email: user.email,
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
    console.log('Test Create Income')
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <div className='flex-1 p-4 md:p-6 lg:p-12 pt-10'>
        <Navbar />
        <div className='mt-10 mb-10'>
          <DailyLedger userId={userId} />
        </div>
      </div>
      <div></div>
      <Footer
        userId={userId}
        onSubmitExpense={handleCreateExpense}
        onSubmitIncome={handleCreateIncome}
      />
    </div>
  )
}

export default HomePage
