import React from 'react'
import DailySummaryCard from './dailySummaryCard'
import { DailyLedgerProps } from '@/lib/types'

function DailyLedger({ dailyTransactions }: DailyLedgerProps) {
  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-white font-bold text-2xl'>Daily Ledger</h2>
      {dailyTransactions.map((dailyTransaction, index) => (
        <DailySummaryCard key={index} {...dailyTransaction} />
      ))}
    </div>
  )
}

export default DailyLedger
