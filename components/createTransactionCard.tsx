import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { FooterProps } from '@/lib/types'

import { CreateExpenseForm } from './createExpenseForm'

export const CreateTransactionCard: React.FC<FooterProps> = ({
  userId,
  onSubmitExpense,
  onSubmitIncome,
}) => {
  const [showCreateTransactionCard, setShowCreateTransactionCard] =
    useState(false)

  const handleShowCard = () => {
    setShowCreateTransactionCard(true)
  }

  return (
    <>
      <button
        className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full'
        onClick={handleShowCard}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
      {showCreateTransactionCard && (
        <Card className='fixed z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-[380px] min-h-fit p-2 bg-gradient-to-br from-[#4D4D4D] to-[#666666] rounded-2xl shadow-lg border-none'>
          <CardContent>
            <CreateExpenseForm
              userId={userId}
              onClose={() => setShowCreateTransactionCard(false)}
              onSubmit={(expenseData) => {
                onSubmitExpense(expenseData)
                setShowCreateTransactionCard(false)
              }}
            />
          </CardContent>
        </Card>
      )}
    </>
  )
}
