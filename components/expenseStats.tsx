'use client'

import React, { useState, useEffect } from 'react'
import { PieChart } from 'react-minimal-pie-chart'
import axios from 'axios'
import { useUser } from '@auth0/nextjs-auth0/client'
import { CategoryColorMap } from '@/lib/types'

const ExpenseStats = () => {
  const [data, setData] = useState<
    { title: string; value: number; color: string }[]
  >([])
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      const fetchUserIdAndExpenses = async () => {
        const response = await axios.get('/api/users', {
          params: {
            auth0Id: user.sub,
          },
        })
        const userId = response.data.id
        const responseExpenses = await axios.get('/api/fetchExpenses', {
          params: {
            userId,
          },
        })
        const expenses = responseExpenses.data
        const expenseData: Map<string, number> = new Map<string, number>()

        expenses.forEach(
          (expense: { category: { name: any }; amount: any }) => {
            if (
              expense &&
              expense.category &&
              expense.category.name &&
              expense.amount
            ) {
              const categoryName = expense.category.name
              const amount = Number(expense.amount)
              if (categoryName && amount) {
                const data = expenseData ?? new Map<string, number>()
                const currentValue = data.get(categoryName) ?? 0
                data.set(categoryName, currentValue + amount)
              }
            }
          }
        )

        const categoryColorMap: CategoryColorMap = {
          Food: '#FFC107',
          Transport: '#2196F3',
          Bills: '#9C27B0',
          Health: '#4CAF50',
          Clothing: '#EE4B2B',
          Education: '#34C759',
          'Social Life': '#9400D3',
          Others: '#2F4F7F',
        }

        const data = Array.from(expenseData, ([title, value]) => {
          const color = categoryColorMap[title] ?? '#CCCCCC'
          return {
            title,
            value: Number(value),
            color,
          }
        })
        setData(data.sort((a, b) => b.value - a.value))
      }
      fetchUserIdAndExpenses()
    }
  }, [user])

  return (
    <div className='p-2'>
      <h2 className='text-white text-xl font-semibold' id='stat-name'>
        Expense Statistics
      </h2>
      <div className='w-full max-w-xs mx-auto'>
        {data.length > 0 ? (
          <div id='pie-chart'>
            <PieChart data={data} radius={40} lineWidth={30} animate />
          </div>
        ) : (
          <div
            id='loading-screen'
            className='flex justify-center items-center h-screen'
          >
            <div
              className='spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full'
              role='status'
            ></div>
            <p className='text-lg text-gray-600'>
              Loading Expense Statistics...
            </p>
          </div>
        )}
        <ul className='flex flex-wrap text-white text-xs justify-center'>
          {data.map((item, index) => (
            <li key={index} className='mr-2 mb-2'>
              <span
                id='stat-color'
                style={{
                  backgroundColor: item.color,
                  width: '10px',
                  height: '10px',
                  display: 'inline-block',
                  marginRight: '10px',
                }}
              />
              <span id='stat-label'>
                {item.title} - {item.value} (
                {Math.round(
                  (item.value / data.reduce((a, b) => a + b.value, 0)) * 100
                )}
                %)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ExpenseStats
