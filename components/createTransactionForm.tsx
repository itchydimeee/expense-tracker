'use client'

import React, { useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

import { CreateTransactionFormProps } from '@/lib/types'

export const CreateTransactionForm: React.FC<CreateTransactionFormProps> = ({
  userId,
  onClose,
  onSubmit,
  transactionType,
}) => {
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState<Date>(new Date())
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!categoryId || !amount) {
      setError('Please fill in all necessary fields')
      return
    }
    if (!userId) {
      setError('Error: userId not found')
      return
    }
    try {
      const transactionData = {
        userId,
        date,
        categoryId,
        description,
        amount,
      }
      console.log('Submitting transaction data: ', transactionData)
      onSubmit(transactionData)
    } catch (error: any) {
      setError(error.message)
      console.error(error.message)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value)
    if (amount <= 0) {
      setError('Invalid input')
      return
    }
    setAmount(amount)
  }

  return (
    <div className='flex items-center justify-center'>
      <div className='max-w-md w-full text-white font-semibold'>
        <label htmlFor='date' className='block mt-2'>
          Date
        </label>
        <input
          id='date'
          className='shadow appearance-none border rounded-md py-2 px-6 font-normal text-gray-800 leading-tight focus:outline-none focus:shadow-outline'
          type='date'
          pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
          value={date.toISOString().slice(0, 10)} // Update this line
          onChange={(e) => setDate(new Date(e.target.value))}
        />
        <label htmlFor='category' className='block mt-2'>
          Category
        </label>
        <select
          className=' h-9 w-full rounded text-gray-800 font-normal px-2'
          id='category'
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value='' disabled hidden>
            Select category...
          </option>
          {transactionType === 'Expense' ? (
            <>
              <option value='1'>Education</option>
              <option value='2'>Transport</option>
              <option value='3'>Food</option>
              <option value='4'>Bills</option>
              <option value='5'>Health</option>
              <option value='6'>Clothing</option>
              <option value='7'>Social Life</option>
              <option value='8'>Others</option>
            </>
          ) : (
            <>
              <option value='1'>Allowance</option>
              <option value='2'>Business</option>
              <option value='3'>Salary</option>
              <option value='4'>Bonus</option>
              <option value='5'>Others</option>
            </>
          )}
        </select>
        <label htmlFor='description' className='block mt-2'>
          Description
        </label>
        <textarea
          id='description'
          className='shadow appearance-none border rounded-md w-full h-16 py-2 px-3 text-gray-800 font-normal text-sm leading-tight focus:outline-none focus:shadow-outline'
          rows={1}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label htmlFor='amount' className='block mt-1'>
          Amount
        </label>
        <input
          id='amount'
          className='shadow appearance-none border rounded-md w-full py-2 px-3 mb-4 font-normal text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline'
          type='number'
          value={amount}
          onChange={handleAmountChange}
        />
        {error && (
          <div className='text-red-300 font-normal text-base mb-2'>{error}</div>
        )}
        <div className='flex justify-end'>
          <Button
            onClick={handleSubmit}
            className=' bg-transparent px-2 py-2 text-center text-base font-semibold border rounded-lg hover:bg-orange-400 active:bg-orange-400'
          >
            {transactionType === 'Expense' ? 'Create Expense' : 'Create Income'}
          </Button>
          <Button
            onClick={onClose}
            className='bg-transparent px-6 py-2 ml-2 text-center text-base font-semibold border rounded-lg hover:bg-red-400 active:bg-red-400'
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateTransactionForm
