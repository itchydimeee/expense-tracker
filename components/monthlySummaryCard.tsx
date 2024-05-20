import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { monthsArray } from '../lib/types';
import { MonthlySummaryCardProps } from '../lib/types';

const MonthlySummaryCard = ({
  currentMonth,
  currentYear,
  monthlyIncomeTotals,
  monthlyExpenseTotals,
  monthlyProfitTotals,
  setCurrentMonth,
  setCurrentYear,
}: MonthlySummaryCardProps) => {
  const monthName = monthsArray[currentMonth];
  const key = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

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
        {monthName} {currentYear}
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
          {(monthlyIncomeTotals[key] || 0).toFixed(2)}
        </span>
        <span className="text-sm text-red-500">
          <h1 className='text-white text-sm'> Expense</h1>
          {(monthlyExpenseTotals[key] || 0).toFixed(2)}
        </span>
        <span className="text-sm text-green-500">
          <h1 className='text-white text-sm'> Profit</h1>
          {(monthlyProfitTotals[key] || 0).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default MonthlySummaryCard;