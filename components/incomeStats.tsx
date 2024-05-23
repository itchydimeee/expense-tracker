'use client'

import React, { useState, useEffect } from 'react'
import { PieChart } from 'react-minimal-pie-chart'
import axios from 'axios'
import { useUser } from '@auth0/nextjs-auth0/client'
import { CategoryColorMap } from '@/lib/types'

const IncomeStats = () => {
  const [data, setData] = useState<
    { title: string; value: number; color: string }[]
  >([])
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      const fetchUserIdAndIncomes = async () => {
        const response = await axios.get('/api/fetchUser', {
          params: {
            email: user.email
          }
        })
        const userId = response.data.id
        const responseIncomes = await axios.get('/api/fetchIncomes', {
          params: {
            userId
          }
        })
        const incomes = responseIncomes.data
        const incomeData: Map<string, number> = new Map<string, number>()

        incomes.forEach((income: { category: { name: any }; amount: any }) => {
          if (
            income &&
            income.category &&
            income.category.name &&
            income.amount
          ) {
            const categoryName = income.category.name
            const amount = Number(income.amount)
            if (categoryName && amount) {
              const data = incomeData ?? new Map<string, number>()
              const currentValue = data.get(categoryName) ?? 0
              data.set(categoryName, currentValue + amount)
            }
          }
        })

        const categoryColorMap: CategoryColorMap = {
            Salary: '#8BC34A',
            Business: '#64B5F6',
            Allowance: '#9C27B0',
            Others: '#00698F',
            Bonus: '#FFC107'

        }

        const data = Array.from(incomeData, ([title, value]) => {
          const color = categoryColorMap[title] ?? '#CCCCCC'
          return {
            title,
            value: Number(value),
            color
          }
        })
        setData(data.sort((a, b) => b.value - a.value))
      }
      fetchUserIdAndIncomes()
    }
  }, [user])

  return (
    <div className='p-2'>
      <h2 className='text-white text-xl font-semibold'>Income Statistics</h2>
      <div className='w-full max-w-xs mx-auto'>
        {data.length > 0 ? (
          <PieChart data={data} radius={40} lineWidth={30} animate />
        ) : (
          <div className='flex justify-center items-center h-screen'>
            <div
              className='spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full'
              role='status'
            >
              <span className='sr-only'>Loading Income Statistics...</span>
            </div>
            <p className='text-lg text-gray-600'>
              Loading Income Statistics...
            </p>
          </div>
        )}
        <ul className='flex flex-wrap text-white text-xs justify-center mt-2'>
          {data.map((item, index) => (
            <li key={index} className='mr-2 mb-2'>
              <span
                style={{
                  backgroundColor: item.color,
                  width: '10px',
                  height: '10px',
                  display: 'inline-block',
                  marginRight: '10px'
                }}
              />
              <span>
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

export default IncomeStats
