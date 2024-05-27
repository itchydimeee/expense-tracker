'use client'

import React, { useState } from 'react'
import ExpenseStats from '@/components/expenseStats'
import IncomeStats from '@/components/incomeStats'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const StatsPage = () => {
  const [activeType, setActiveType] = useState('expenses')

  const handleTypeChange = (type: React.SetStateAction<string>) => {
    setActiveType(type)
  }

  return (
    <div className='h-screen flex flex-col'>
        <Navbar />
      <div className='pt-8'>
        <div className='mt-10 mb-20'>
          <button
            className={`text-white px-2 py-1 m-2 rounded-xl ${
              activeType === 'expenses' ? 'bg-orange-500' : ''
            }`}
            onClick={() => handleTypeChange('expenses')}
          >
            Expenses
          </button>
          <button
            id="income-stat-button"
            className={`text-white px-2 py-1 m-2 rounded-xl ${
              activeType === 'income' ? 'bg-orange-500' : ''
            }`}
            onClick={() => handleTypeChange('income')}
          >
            Income
          </button>
          {activeType === 'expenses' ? <ExpenseStats /> : <IncomeStats />}
        </div>
      </div>
      <div className='h-16 bg-white shadow-md fixed bottom-0 left-0 right-0'>
        <Footer />
      </div>
    </div>
  )
}

export default StatsPage
