'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { monthsArray, MonthlySummaryCardProps } from '@/lib/types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'

function MonthlySummaryCard({
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
}: MonthlySummaryCardProps) {
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  return (
    <Card className='bg-secondary border-none rounded-3xl drop-shadow-lg text-white mb-8'>
      <CardHeader className='flex flex-row justify-center py-1'>
        <CardTitle className='font-semibold text-xl'>
          <button onClick={() => handlePrevMonth()}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>{' '}
          {`${monthsArray[selectedMonth]} ${selectedYear}`}{' '}
          <button onClick={() => handleNextMonth()}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </CardTitle>
      </CardHeader>
      <div className='border-b border-[#4D4D4D] mx-2'></div>
      <CardContent className='flex flex-col pt-1 pb-3 px-4'>
        <div className='flex flex-row justify-between text-sm font-medium text-center'>
          <div className='w-1/3'>Income</div>
          <div className='w-1/3'>Expense</div>
          <div className='w-1/3'>Total</div>
        </div>
        <div className='flex flex-row justify-between text-sm font-semibold text-center'>
          <div className='w-1/3 text-[#578CF7]'>5000.00</div>
          <div className='w-1/3 text-[#991B1B]'>2000.00</div>
          <div className='w-1/3 text-[#98FB98]'>3000.00</div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MonthlySummaryCard
