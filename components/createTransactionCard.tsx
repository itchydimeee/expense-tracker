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

import { CreateTransactionCardProps } from '@/lib/types'

import CreateTransactionForm from './createTransactionForm'

export const CreateTransactionCard: React.FC<CreateTransactionCardProps> = ({
  userId,
  onSubmitExpense,
  onSubmitIncome,
}) => {
  const [createTransactionType, setCreateTransactionType] = useState<
    'Expense' | 'Income'
  >('Expense')
  const [showCreateTransactionCard, setShowCreateTransactionCard] =
    useState(false)

  const handleShowCard = () => {
    setShowCreateTransactionCard(true)
  }

  return (
    <>
      <button
        id="create-button"
        className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full'
        onClick={handleShowCard}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
      {showCreateTransactionCard && (
        <Card className='fixed z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-[380px] min-h-fit p-2 bg-gradient-to-br from-[#4D4D4D] to-[#666666] rounded-2xl shadow-lg border-none'>
          <CardHeader className='mb-0 pb-2'>
            <div className='flex flex-row'>
              <button
                onClick={() => setCreateTransactionType('Expense')}
                className={`font-semibold py-2 px-8 rounded mr-2 border border-white ${
                  createTransactionType === 'Expense'
                    ? 'bg-white text-black'
                    : 'bg-transparent text-white '
                }`}
              >
                <div>Expense</div>
              </button>
              <button
                id="set-create-income"
                onClick={() => setCreateTransactionType('Income')}
                className={`font-semibold py-2 px-8 rounded border border-white ${
                  createTransactionType === 'Income'
                    ? 'bg-white text-black'
                    : 'bg-transparent text-white'
                }`}
              >
                <div>Income</div>
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <CreateTransactionForm
              userId={userId}
              onClose={() => setShowCreateTransactionCard(false)}
              onSubmit={(transactionData) => {
                if (createTransactionType === 'Expense')
                  onSubmitExpense(transactionData)
                if (createTransactionType === 'Income')
                  onSubmitIncome(transactionData)
                setShowCreateTransactionCard(false)
              }}
              transactionType={createTransactionType}
            />
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default CreateTransactionCard
