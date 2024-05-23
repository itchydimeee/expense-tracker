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

import {
  CreateTransactionFormProps,
  expenseCategoryMapping,
  incomeCategoryMapping,
} from '@/lib/types'

export const CreateTransactionForm: React.FC<CreateTransactionFormProps> = ({
  userId,
  onClose,
  onSubmit,
  transactionType,
}) => {
  const [category, setCategory] = useState('')
  const [date, setDate] = useState<Date>(new Date())
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!category || !amount) {
      setError('Please fill in all necessary fields')
      return
    }
    if (!userId) {
      setError('Error: userId not found')
      return
    }
    try {
      const categoryId =
        transactionType === 'Expense'
          ? expenseCategoryMapping[category]
          : incomeCategoryMapping[category]
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
      <form
        onSubmit={handleSubmit}
        className='max-w-md w-full text-white font-semibold'
      >
        <label className='block mt-2'>Date</label>
        <input
          className='shadow appearance-none border rounded-md py-2 px-6 font-regular text-gray-800 leading-tight focus:outline-none focus:shadow-outline'
          type='date'
          pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
          value={date.toISOString().slice(0, 10)} // Update this line
          onChange={(e) => setDate(new Date(e.target.value))}
        />
        <label className='block mt-2'>Category</label>
        <Select value={category} onValueChange={(value) => setCategory(value)}>
          <SelectTrigger className='bg-white text-black border border-gray-300 rounded-md'>
            <SelectValue placeholder={category} />
          </SelectTrigger>
          <SelectContent>
            {transactionType === 'Expense' ? (
              <>
                <SelectItem value='Education'>Education</SelectItem>
                <SelectItem value='Transport'>Transport</SelectItem>
                <SelectItem value='Food'>Food</SelectItem>
                <SelectItem value='Bills'>Bills</SelectItem>
                <SelectItem value='Health'>Health</SelectItem>
                <SelectItem value='Clothing'>Clothing</SelectItem>
                <SelectItem value='SocialLife'>Social Life</SelectItem>
                <SelectItem value='Others'>Others</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value='Allowance'>Allowance</SelectItem>
                <SelectItem value='Business'>Business</SelectItem>
                <SelectItem value='Salary'>Salary</SelectItem>
                <SelectItem value='Bonus'>Bonus</SelectItem>
                <SelectItem value='Others'>Others</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
        <label className='block mt-2'>Description</label>
        <textarea
          className='shadow appearance-none border rounded-md w-full h-16 py-2 px-3 text-gray-800 font-regular text-sm leading-tight focus:outline-none focus:shadow-outline'
          rows={1}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label className='block mb-4'>
          Amount:
          <input
            className='shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline'
            type='number'
            value={amount}
            onChange={handleAmountChange}
          />
        </label>
        {error && (
          <div className='text-red-300 font-normal text-base mb-2'>{error}</div>
        )}
        <div className='flex justify-end'>
          <Button
            type='submit'
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
      </form>
    </div>
  )
}

export default CreateTransactionForm
