import { useState, FormEvent } from 'react'
import axios from 'axios'
import ExpenseCategory from './expenseCategories'

import { Expenses } from '@/lib/types'
import DeleteExpense from './deleteExpenses'

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
    date: new Date(expense.date),
    category: expense.category,
    type: 'expenses',
  })
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    if (name === 'amount' && parseFloat(value) <= 0) {
      setError('Invalid amount')
      return
    }
    setUpdatedExpense({ ...updatedExpense, [name]: value })
  }

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setUpdatedExpense({ ...updatedExpense, categoryId: event.target.value })
  }

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedExpense({ ...updatedExpense, date: new Date(event.target.value) })
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()

    if (!updatedExpense.amount) {
      setError('Please fill in all necessary fields')
      return
    }

    try {
      console.log('Updating expense: ', updatedExpense)
      const response = await axios.put('/api/updateExpenses', updatedExpense)

      if (response.data.error) {
        console.error('Failed to update expense:', response.data.error)
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating expense:', error)
    }
  }

  return (
    <div className='fixed z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-[380px] min-h-fit px-6 pb-4 bg-gradient-to-br from-[#4D4D4D] to-[#666666] rounded-2xl shadow-lg border-none'>
      <div className='flex items-center justify-center'>
        <form
          onSubmit={handleSubmit}
          className='max-w-md w-full text-white font-semibold'
        >
          <label className='block mt-2'>Date</label>
          <input
            className='shadow appearance-none border rounded py-2 px-6 font-normal text-gray-800 leading-tight focus:outline-none focus:shadow-outline'
            type='date'
            pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
            value={updatedExpense.date.toISOString().slice(0, 10)} // Update this line
            onChange={handleDateChange}
          />
          <label className='block mt-2'>Category</label>
          <ExpenseCategory
            onChange={handleCategoryChange}
            value={updatedExpense.categoryId}
          />
          <label className='block mt-2'>
            Description
            <input
              type='text'
              name='description'
              value={updatedExpense.description}
              onChange={handleInputChange}
              className='w-full p-2 pl-4 text-sm rounded text-gray-700'
            />
          </label>
          <label className='block mt-2'>
            Amount
            <input
              id="update-amount"
              type='number'
              name='amount'
              value={updatedExpense.amount}
              onChange={handleInputChange}
              className='w-full p-2 pl-4 text-sm rounded text-gray-700'
            />
          </label>
          {error && (
            <div className='text-red-300 font-normal text-base mb-2'>
              {error}
            </div>
          )}
          <div className='flex justify-between mt-4 text-sm pl-3'>
            <button
              id="update-button"
              type='submit'
              className='bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-3 rounded'
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
