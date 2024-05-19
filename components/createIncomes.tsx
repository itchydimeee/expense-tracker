'use client'

import { useState, useEffect, FormEvent } from 'react'
import axios from 'axios'
import { useUser } from '@auth0/nextjs-auth0/client'
import IncomeCategory from './incomeCategories'

import { Income } from '@/lib/types'

function CreateIncomes() {
  const [newIncome, setNewIncome] = useState<Income>({
    name: '',
    categoryId: '',
    description: '',
    amount: '',
    userId: '',
  })
  const [showForm, setShowForm] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState('') 
  const { user, isLoading } = useUser()

  useEffect(() => {
    const fetchUserId = async () => {
      if (!user) return
      try {
        const response = await axios.get('/api/fetchUser', {
          params: {
            email: user.email,
          },
        })
        const userId = response.data.id
        setNewIncome({ ...newIncome, userId })
      } catch (error) {
        console.error(error)
      }
    }
    fetchUserId()
  }, [user, newIncome])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewIncome({ ...newIncome, [event.target.name]: event.target.value })
  }

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const categoryId = event.target.value
    setNewIncome({ ...newIncome, categoryId })
    setSelectedCategoryId(categoryId) 
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

    if (!newIncome.userId) {
      console.error('User ID is not available')
      return
    }

    try {
      const response = await axios.post(`/api/createIncomes`, {
        categoryId: newIncome.categoryId,
        description: newIncome.description,
        amount: newIncome.amount,
        userId: newIncome.userId,
        date: new Date().toISOString(),
      })
      console.log(response)

      if (response.data.error) {
        console.error('Failed to create income:', response.data.error)
      } else {
        setNewIncome({
          name: '',
          categoryId: '',
          description: '',
          amount: '',
          userId: '',
        })
        setShowForm(false)
        window.location.reload()
      }
    } catch (error) {
      console.error('Error creating income:', error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='max-w-md mx-auto p-4 pt-6 fixed bottom-0 left-4'>
      <button
        className='bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4'
        onClick={handleShowForm}
      >
        Create Income
      </button>
      {showForm && (
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50'>
          <div className='bg-white p-4 rounded shadow-md w-full md:w-1/2 xl:w-1/3'>
            <form onSubmit={handleSubmit}>
              <label className='block mb-2'>
                Category:
                <IncomeCategory
                  onChange={handleCategoryChange}
                  value={selectedCategoryId}
                />
              </label>
              <label className='block mb-2'>
                Description:
                <input
                  type='text'
                  name='description'
                  value={newIncome.description}
                  onChange={handleInputChange}
                  className='w-full p-2 pl-10 text-sm text-gray-700'
                />
              </label>
              <label className='block mb-2'>
                Amount:
                <input
                  type='number'
                  name='amount'
                  value={newIncome.amount}
                  onChange={handleInputChange}
                  className='w-full p-2 pl-10 text-sm text-gray-700'
                />
              </label>
              <button
                type='submit'
                className='bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded'
              >
                Create Income
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

export default CreateIncomes
