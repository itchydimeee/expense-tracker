"use client"

import { useState,useEffect, FormEvent } from 'react'
import axios from 'axios'
import { useUser } from '@auth0/nextjs-auth0/client'
import ExpenseCategory from './expenseCategories'

import { Expense } from '@/lib/types'

function CreateExpenses () {
  const [newExpense, setNewExpense] = useState<Expense>({
    name: '',
    categoryId: '',
    description: '',
    amount: '',
    userId: '',
  })
  const [showForm, setShowForm] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState('') // Add this state
  const { user, isLoading } = useUser()

  useEffect(() => {
    if (user) {
      const fetchUserId = async () => {
        try {
          const response = await axios.get('/api/fetchUser', {
            params: {
              email: user.email
            }
          })
          const userId = response.data.id
          setNewExpense({ ...newExpense, userId })
        } catch (error) {
          console.error(error)
        }
      }
      fetchUserId()
    }
  }, [user])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewExpense({ ...newExpense, [event.target.name]: event.target.value })
  }

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = event.target.value
    setNewExpense({ ...newExpense, categoryId })
    setSelectedCategoryId(categoryId) // Update the selectedCategoryId state
  }

  const handleShowForm = () => {
    setShowForm(true)
  }

  const handleHideForm = () => {
    setShowForm(false)
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()

    if (!newExpense.userId) {
      console.error('User ID is not available')
      return
    }

    try {
      const response = await axios.post(`/api/createExpenses`, {
        categoryId: newExpense.categoryId,
        description: newExpense.description,
        amount: newExpense.amount,
        userId: newExpense.userId,
        date: new Date().toISOString()
      })
      console.log(response)

      if (response.data.error) {
        console.error('Failed to create expense:', response.data.error)
      } else {
        setNewExpense({
          name: '',
          categoryId: '',
          description: '',
          amount: '',
          userId: '',
        })
        setShowForm(false)
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating expense:', error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='max-w-md mx-auto p-4 pt-6'>
      <button
        className='bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded fixed bottom-4 right-4'
        onClick={handleShowForm}
      >
        Create Expense
      </button>
      {showForm && (
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50'>
          <div className='bg-white p-4 rounded shadow-md w-full md:w-1/2 xl:w-1/3'>
            <form onSubmit={handleSubmit}>
              <label className='block mb-2'>
                Category:
                <ExpenseCategory onChange={handleCategoryChange} value={selectedCategoryId} /> 
              </label>
              <label className='block mb-2'>
                Description:
                <input
                  type='text'
                  name='description'
                  value={newExpense.description}
                  onChange={handleInputChange}
                  className='w-full p-2 pl-10 text-sm text-gray-700'
                />
              </label>
              <label className='block mb-2'>
                Amount:
                <input
                  type='number'
                  name='amount'
                  value={newExpense.amount}
                  onChange={handleInputChange}
                  className='w-full p-2 pl-10 text-sm text-gray-700'
                />
              </label>
              <button
                type='submit'
                className='bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded'
              >
                Create Expense
              </button>
              <button
                className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'
                onClick={handleHideForm}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateExpenses