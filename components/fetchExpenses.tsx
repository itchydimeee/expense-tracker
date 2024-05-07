"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Expenses } from '@/lib/types';

function FetchExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

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
        setExpenses(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="sr-only">Loading expenses...</span>
        </div>
        <p className="text-lg text-gray-600">Loading expenses...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 pt-6 pb-8 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <p>{error}</p>
        </div>
      )}
      <ul className="list-none mb-0">
        {Array.isArray(expenses) && expenses.length > 0 ? (
          expenses.map((expense: Expenses) => (
            <li key={expense.userId} className="flex justify-between py-4 border-b border-gray-200">
              <span className="text-lg w-1/4">{expense.category.name}</span>
              <span className="text-lg w-1/2">{`${expense.description.slice(0, 20)}${expense.description.length > 20 ? '...' : ''}`}</span>
              <span className="text-lg w-1/4 text-right">{expense.amount}</span>
            </li>
          ))
        ) : (
          <li className="py-2 text-gray-600">
            <p>No expenses found.</p>
          </li>
        )}
      </ul>
    </div>
  );
}

export default FetchExpenses;
