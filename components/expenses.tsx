'use client'
import { useState, useEffect, FormEvent } from 'react'
import axios from 'axios'
import { useUser } from '@auth0/nextjs-auth0/client'

interface Expense {
  name: string
  categoryId: string
  description: string
  amount: string
}

function Expenses () {
  const [newExpense, setNewExpense] = useState<Expense>({
    name: '',
    categoryId: '',
    description: '',
    amount: ''
  })
  const [showForm, setShowForm] = useState(false)
  const { user } = useUser();

  useEffect(() => {
    async function fetchUser() {
      const auth0Id = user?.sub;

      try {
        const response = await axios.get(`/api/fetchUser?userId=${auth0Id}`);
        
        if (response.data.error) {
          const createUserResponse = await axios.post('/api/fetchUser', {
            auth0Id,
            email: user?.email,
            username: user?.name
          });
          
          if (createUserResponse.data.error) {
            console.error('Failed to create user:', createUserResponse.data.error);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }

    fetchUser(); 
  }, [user?.email, user?.name, user?.sub]); 
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewExpense({ ...newExpense, [event.target.name]: event.target.value })
  }

  const handleShowForm = () => {
    setShowForm(true)
  }

  const handleHideForm = () => {
    setShowForm(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    throw new Error('Function not implemented.')
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
                Name:
                <input
                  type='text'
                  name='name'
                  value={newExpense.name}
                  onChange={handleInputChange}
                  className='w-full p-2 pl-10 text-sm text-gray-700'
                />
              </label>
              <label className='block mb-2'>
                Category ID:
                <input
                  type='number'
                  name='categoryId'
                  value={newExpense.categoryId}
                  onChange={handleInputChange}
                  className='w-full p-2 pl-10 text-sm text-gray-700'
                />
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

export default Expenses
