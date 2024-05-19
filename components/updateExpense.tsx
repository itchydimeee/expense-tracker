import { useState, FormEvent } from 'react'
import axios from 'axios'

import { Expenses } from '@/lib/types'
import DeleteExpense from './deleteExpenses'
import ExpenseCategory from './expenseCategories'
import FinancialTracker from './financialTracker'

function UpdateExpense({
  expense,
  cancelEdit,
}: {
  expense: Expenses
  cancelEdit: () => void
}) {
  const [updatedExpense, setUpdatedExpense] = useState<Expenses>({
    id: expense.id,
    categoryId: expense.categoryId,
    description: expense.description,
    amount: expense.amount,
    userId: expense.userId,
    user: expense.user,
    date: expense.date,
    category: expense.category,
    type: 'expenses',
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedExpense({
      ...updatedExpense,
      [event.target.name]: event.target.value,
    })
  }

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setUpdatedExpense({ ...updatedExpense, categoryId: event.target.value })
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()

    try {
      const response = await axios.put('/api/updateExpenses', updatedExpense)
      console.log(response)

      if (response.data.error) {
        console.error('Failed to update expense:', response.data.error)
      } else {
        window.location.reload()
        FinancialTracker()
      }
    } catch (error) {
      console.error('Error updating expense:', error)
    }
  }

  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50'>
      <div className='bg-gray-700 rounded-2xl text-white p-4 shadow-md w-full md:w-1/2 xl:w-1/3'>
        <form onSubmit={handleSubmit}>
          <label className='block mb-2'>
            Category:
            <ExpenseCategory
              onChange={handleCategoryChange}
              value={updatedExpense.categoryId}
            />
          </label>
          <label className='block mb-2'>
            Description:
            <input
              type='text'
              name='description'
              value={updatedExpense.description}
              onChange={handleInputChange}
              className='w-full p-2 pl-10 text-sm bg-gray-300 rounded-xl text-gray-700'
            />
          </label>
          <label className='block mb-2'>
            Amount:
            <input
              type='number'
              name='amount'
              value={updatedExpense.amount}
              onChange={handleInputChange}
              className='w-full p-2 pl-10 text-sm rounded-xl bg-gray-300 text-gray-700'
            />
          </label>
          <div className='flex justify-between'>
            <button
              type='submit'
              className='bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded'
            >
              Update Expense
            </button>
            <div className='flex justify-end'>
              <DeleteExpense
                expenseId={expense.id || ''}
                onDelete={cancelEdit}
              />
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

export default UpdateExpense
