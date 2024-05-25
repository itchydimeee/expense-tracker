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
        <label id='category' className='block mt-2'>
          Category
        </label>
        <Select
          value={categoryId}
          onValueChange={(value) => setCategoryId(value)}
        >
          <SelectTrigger
            aria-labelledby='category'
            className='bg-white text-gray-800 font-normal border border-gray-300 rounded-md'
          >
            <SelectValue placeholder='Select category...' />
          </SelectTrigger>
          <SelectContent>
            {transactionType === 'Expense' ? (
              <>
                <SelectItem value='1'>Education</SelectItem>
                <SelectItem value='2'>Transport</SelectItem>
                <SelectItem value='3'>Food</SelectItem>
                <SelectItem value='4'>Bills</SelectItem>
                <SelectItem value='5'>Health</SelectItem>
                <SelectItem value='6'>Clothing</SelectItem>
                <SelectItem value='7'>Social Life</SelectItem>
                <SelectItem value='8'>Others</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value='1'>Allowance</SelectItem>
                <SelectItem value='2'>Business</SelectItem>
                <SelectItem value='3'>Salary</SelectItem>
                <SelectItem value='4'>Bonus</SelectItem>
                <SelectItem value='5'>Others</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
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
        <label htmlFor='amount' className='block mt-2'>
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
