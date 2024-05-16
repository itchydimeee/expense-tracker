'use client'

import DailyLedger from '@/components/dailyLedger'
// import DailyLedger from '@/components/newDailyLedger'
import MonthlySummaryCard from '@/components/monthlySummaryCard'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { useUser } from '@auth0/nextjs-auth0/client'

const HomePage = () => {
  const { error, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  const transactions: {
    date: string
    transactions: {
      id: number
      type: 'income' | 'expense'
      category: string
      description: string
      amount: number
      createdAt: string
    }[]
  }[] = [
    {
      date: '2024-03-01',
      transactions: [
        {
          id: 1,
          type: 'income',
          category: 'Salary',
          description: 'Monthly salary',
          amount: 5000,
          createdAt: '2024-03-01 09:00:00',
        },
        {
          id: 2,
          type: 'expense',
          category: 'Food',
          description: 'Lunch at restaurant',
          amount: 20,
          createdAt: '2024-03-01 12:00:00',
        },
        {
          id: 3,
          type: 'expense',
          category: 'Transportation',
          description: 'Gasoline',
          amount: 30,
          createdAt: '2024-03-01 14:00:00',
        },
      ],
    },
    {
      date: '2024-03-02',
      transactions: [
        {
          id: 4,
          type: 'income',
          category: 'Interest',
          description: 'Bank interest',
          amount: 100,
          createdAt: '2024-03-02 09:00:00',
        },
        {
          id: 5,
          type: 'expense',
          category: 'Entertainment',
          description: 'Movie ticket',
          amount: 15,
          createdAt: '2024-03-02 18:00:00',
        },
      ],
    },
    // Add more days of transactions here...
  ]

  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <div className='flex-1 p-4 md:p-6 lg:p-12 pt-10'>
        <Navbar />
        <div className='mt-10 mb-10'>
          <DailyLedger />
        </div>
      </div>
      <div></div>
      <Footer />
    </div>
  )
}

export default HomePage
