import React, { useState } from 'react';
import UpdateIncome from './updateIncome';
import UpdateExpense from './updateExpense';
import { DailySummaryCardProps } from '@/lib/types';

const DailySummaryCard: React.FC<DailySummaryCardProps> = ({
  filteredDates,
  incomes,
  expenses,
  incomeTotals,
  expenseTotals
}) => {
  const [editId, setEditId] = useState<string | null>(null);
  const cancelEdit = () => {
    setEditId(null);
  };

  return (
    <div className="max-w-md p-2">
      {filteredDates
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        .map((date) => {
          const dateObject = new Date(date);
          const dayOfWeek = dateObject.toLocaleDateString('en-US', {
            weekday: 'short',
          });
          const dayOfMonth = dateObject.getDate();
          return (
            <div key={date} className="mb-4 bg-secondary rounded-3xl p-2">
              <div className="flex justify-between border-b border-gray-900 ">
                <div className="flex px-2">
                  <h2 className="text-lg text-white font-bold px-1 ">
                    {dayOfMonth}
                  </h2>
                  <h2 className="text-xs font-bold text-white px-1 py-1 bg-background rounded-md mb-1 mt-1">
                    {dayOfWeek}
                  </h2>
                </div>
                <div className="flex justify-end">
                  <span className="text-sm text-blue-500 w-20 text-right">
                    {(incomeTotals[date] || 0).toFixed(2)}
                  </span>
                  <span className="text-sm text-red-500 w-20 text-right ml-2">
                    {(expenseTotals[date] || 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="p-4 rounded">
                <ul className="list-none">
                  {(incomes[date] || []).map((income) => (
                    <li key={income.id} className="flex justify-between py-1">
                      {editId === income.id ? (
                        <UpdateIncome income={income} cancelEdit={cancelEdit} />
                      ) : (
                        <>
                          <div
                            className="flex justify-between w-full cursor-pointer"
                            onClick={() => {
                              if (income.id) {
                                setEditId(income.id);
                              }
                            }}
                          >
                            <span className="text-sm text-white">
                              {income.category.name}
                            </span>
                            <span className="text-sm truncate text-white">
                              {income.description.length > 15
                                ? `${income.description.substring(0, 15)}...`
                                : income.description}
                            </span>
                            <span className="text-sm text-right text-blue-600">
                              {Number(income.amount).toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                  {(expenses[date] || []).map((expense) => (
                    <li key={expense.id} className="flex justify-between py-1">
                      {editId === expense.id ? (
                        <UpdateExpense
                          expense={expense}
                          cancelEdit={cancelEdit}
                        />
                      ) : (
                        <>
                          <div
                            className="flex justify-between w-full cursor-pointer"
                            onClick={() => {
                              if (expense.id) {
                                setEditId(expense.id);
                              }
                            }}
                          >
                            <span className="text-sm text-white">
                              {expense.category.name}
                            </span>
                            <span className="text-sm truncate text-white">
                              {expense.description.length > 15
                                ? `${expense.description.substring(0, 15)}...`
                                : expense.description}
                            </span>
                            <span className="text-sm text-right text-red-500">
                              {Number(expense.amount).toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default DailySummaryCard;