import React from 'react'
import DailySummaryCard from './dailySummaryCard'
import { DailyLedgerProps } from '@/lib/types'

function DailyLedger({ dailyTransactions }: DailyLedgerProps) {
  return (
    <div className='flex flex-col gap-4'>
      {dailyTransactions.map((dailyTransaction, index) => (
        <DailySummaryCard key={index} {...dailyTransaction} />
      ))}
    </div>
  )
}

export default DailyLedger
