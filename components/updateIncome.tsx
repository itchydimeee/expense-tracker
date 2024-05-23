import { useState, FormEvent } from 'react'
import axios from 'axios'
import IncomeCategory from './incomeCategories'

import { Incomes } from '@/lib/types'
import DailyLedger from './dailyLedger'
import DeleteIncome from './deleteIncome'

function UpdateIncome({
  income,
  cancelEdit,
}: {
  income: Incomes
  cancelEdit: () => void
}) {
  const [updatedIncome, setUpdatedIncome] = useState<Incomes>({
    id: income.id,
    categoryId: income.categoryId,
    description: income.description,
    amount: income.amount,
    userId: income.userId,
    user: income.user,
    date: income.date,
    category: income.category,
    dailySummaries: income.dailySummaries,
    type: 'income',
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedIncome({
      ...updatedIncome,
      [event.target.name]: event.target.value,
    })
  }

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setUpdatedIncome({ ...updatedIncome, categoryId: event.target.value })
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()

    try {
      const response = await axios.put('/api/updateIncomes', updatedIncome)
      console.log(response)

      if (response.data.error) {
        console.error('Failed to update income:', response.data.error)
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating income:', error)
    }
  }

  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50'>
      <div className='bg-gray-700 rounded-2xl text-white p-4  shadow-md w-full md:w-1/2 xl:w-1/3'>
        <form onSubmit={handleSubmit}>
          <label className='block mb-2'>
            Category:
            <IncomeCategory
              onChange={handleCategoryChange}
              value={updatedIncome.categoryId}
            />
          </label>
          <label className='block mb-2'>
            Description:
            <input
              type='text'
              name='description'
              value={updatedIncome.description}
              onChange={handleInputChange}
              className='w-full p-2 pl-10 text-sm bg-gray-300 rounded-xl text-gray-700'
            />
          </label>
          <label className='block mb-2'>
            Amount:
            <input
              type='number'
              name='amount'
              value={updatedIncome.amount}
              onChange={handleInputChange}
              className='w-full p-2 pl-10 text-sm rounded-xl bg-gray-300 text-gray-700'
            />
          </label>
          <div className='flex justify-between'>
            <button
              type='submit'
              className='bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded'
            >
              Update Income
            </button>
            <div className='flex justify-end'>
              <DeleteIncome incomeId={income.id || ''} onDelete={cancelEdit} />
              <button
                className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateIncome
