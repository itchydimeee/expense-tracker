'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Expenses } from '@/lib/types';
import UpdateExpense from './updateExpense';

function FetchExpenses() {
  const [expenses, setExpenses] = useState<{ [date: string]: Expenses[] }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading } = useUser();
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  function cancelEdit() {
    setEditId(null);
  }

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    if (user) {
      try {
        const fetchUser = await axios.get('/api/fetchUser', {
          params: {
            email: user.email,
          },
        });
        const userId = fetchUser.data.id;
        const response = await axios.get(`/api/fetchExpenses`, {
          params: {
            userId: userId,
          },
        });
        const expensesData = response.data;
        // Sort expenses by date in descending order (newest first)
        expensesData.sort((a: any, b: any) => b.date - a.date);
        // Group expenses by date
        const groupedExpenses: { [date: string]: Expenses[] } = {};
        expensesData.forEach((expense: Expenses) => {
          const date = new Date(expense.date);
          const dateString = date.toLocaleDateString();
          if (!groupedExpenses[dateString]) {
            groupedExpenses[dateString] = [];
          }
          groupedExpenses[dateString].push(expense);
        });
        setExpenses(groupedExpenses);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch expenses');
      } finally {
        setLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div
          className='spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full'
          role='status'
        >
          <span className='sr-only'>Loading...</span>
        </div>
        <p className='text-lg text-gray-600'>Loading...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div
          className='spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full'
          role='status'
        >
          <span className='sr-only'>Loading expenses...</span>
        </div>
        <p className='text-lg text-gray-600'>Loading expenses...</p>
      </div>
    );
  }

  return (
    <div className='max-w-md mx-auto p-4 pt-6 pb-8 bg-white rounded shadow-md'>
      <h1 className='text-2xl font-bold mb-4'>Expenses</h1>
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>
          <p>{error}</p>
        </div>
      )}
      {Object.keys(expenses).map(date => (
        <div key={date}>
          <h2 className='text-lg font-bold mb-2'>{date}</h2>
          <ul className='list-none mb-0'>
            {expenses[date].map(expense => (
              <li
                key={expense.id}
                className='flex justify-between py-4 border-b border-gray-200'
              >
                {editId === expense.id ? (
                  <UpdateExpense expense={expense} cancelEdit={cancelEdit} />
                ) : (
                  <>
                    <div
                      className='flex justify-between w-full'
                      onClick={() => expense.id && setEditId(expense.id)}
                    >
                      <span className='w-1/4 text-lg'>{expense.category.name}</span>
                      <span className='w-1/2 text-lg truncate'>
                        {expense.description.length > 20
                          ? `${expense.description.substring(0, 20)}...`
                          : expense.description}
                      </span>
                      <span className='w-1/4 text-lg text-right'>{expense.amount}</span>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default FetchExpenses;