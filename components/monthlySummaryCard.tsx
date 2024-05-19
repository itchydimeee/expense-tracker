import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { monthsArray } from '../lib/types';

interface MonthlySummaryCardProps {
  currentMonth: number;
  currentYear: number;
  monthlyIncomeTotals: { [date: string]: number };
  monthlyExpenseTotals: { [date: string]: number };
  monthlyProfitTotals: { [date: string]: number };
  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
}

const MonthlySummaryCard = ({
  currentMonth,
  currentYear,
  monthlyIncomeTotals,
  monthlyExpenseTotals,
  monthlyProfitTotals,
  setCurrentMonth,
  setCurrentYear,
}: MonthlySummaryCardProps) => {
  const monthName = monthsArray[currentMonth]
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="max-w-md p-2 rounded-3xl bg-secondary">
      <div className="text-lg text-center text-white border-b border-gray-900 mb-2 font-bold">
        <button
          className="mr-4 text-white text-bold"
          onClick={handlePreviousMonth}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        {monthsArray[currentMonth]} {currentYear}
        <button
          className="ml-4 text-white text-bold"
          onClick={handleNextMonth}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-blue-500">
          <h1 className='text-white text-sm'> Income</h1>
          {(monthlyIncomeTotals[monthName] || 0).toFixed(2)}
        </span>
        <span className="text-sm text-red-500">
        <h1 className='text-white text-sm'> Expense</h1>
          {(monthlyExpenseTotals[monthName] || 0).toFixed(2)}
        </span>
        <span className="text-sm text-green-500">
        <h1 className='text-white text-sm'> Profit</h1>
          {(monthlyProfitTotals[monthName] || 0).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default MonthlySummaryCard;