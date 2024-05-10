"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Incomes, Expenses } from "@/lib/types";
import UpdateExpense from "./updateExpense";
import UpdateIncome from "./updateIncome";

function DailyLedger() {
  const [incomes, setIncomes] = useState<{ [date: string]: Incomes[] }>({});
  const [expenses, setExpenses] = useState<{ [date: string]: Expenses[] }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading } = useUser();
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  function cancelEdit() {
    setEditId(null);
  }

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    if (user) {
      try {
        const fetchUser = await axios.get("/api/fetchUser", {
          params: {
            email: user.email,
          },
        });
        const userId = fetchUser.data.id;
        const incomeResponse = await axios.get(`/api/fetchIncomes`, {
          params: {
            userId: userId,
          },
        });
        const expenseResponse = await axios.get(`/api/fetchExpenses`, {
          params: {
            userId: userId,
          },
        });
        const incomeData = incomeResponse.data;
        const expenseData = expenseResponse.data;
        const combinedTransactions = combineTransactions(
          incomeData,
          expenseData
        );
        setIncomes(combinedTransactions.incomes);
        setExpenses(combinedTransactions.expenses);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    }
  };

  const combineTransactions = (incomes: Incomes[], expenses: Expenses[]) => {
    const combinedTransactions: {
      incomes: { [date: string]: Incomes[] };
      expenses: { [date: string]: Expenses[] };
    } = { incomes: {}, expenses: {} };
    incomes.forEach((income: Incomes) => {
      const date = new Date(income.date);
      const dateString = date.toLocaleDateString();
      if (!combinedTransactions.incomes[dateString]) {
        combinedTransactions.incomes[dateString] = [];
      }
      combinedTransactions.incomes[dateString].push(income);
    });
    expenses.forEach((expense: Expenses) => {
      const date = new Date(expense.date);
      const dateString = date.toLocaleDateString();
      if (!combinedTransactions.expenses[dateString]) {
        combinedTransactions.expenses[dateString] = [];
      }
      combinedTransactions.expenses[dateString].push(expense);
    });
    return combinedTransactions;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
          role="status"
        >
          <span className="sr-only">Loading transactions...</span>
        </div>
        <p className="text-lg text-gray-600">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 pt-6 pb-8 bg-gray-200 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Daily Ledger</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <p>{error}</p>
        </div>
      )}
      {Object.keys({ ...incomes, ...expenses })
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        .map((date) => (
          <div key={date}>
            <h2 className="text-lg font-bold mb-2">{date}</h2>
            <ul className="list-none mb-0">
              {(incomes[date] || []).map((income) => (
                <li
                  key={income.id}
                  className="flex justify-between py-4 border-b border-gray-200"
                >
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
                        <span className="w-1/4 text-lg">
                          {income.category.name}
                        </span>
                        <span className="w-1/2 text-lg truncate">
                          {income.description.length > 20
                            ? `${income.description.substring(0, 20)}...`
                            : income.description}
                        </span>
                        <span
                          className={`w-1/4 text-lg text-right text-blue-600`}
                        >
                          {income.amount}
                        </span>
                      </div>
                    </>
                  )}
                </li>
              ))}
              {(expenses[date] || []).map((expense) => (
                <li
                  key={expense.id}
                  className="flex justify-between py-4 border-b border-gray-200"
                >
                  {editId === expense.id ? (
                    <UpdateExpense expense={expense} cancelEdit={cancelEdit} />
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
                        <span className="w-1/4 text-lg">
                          {expense.category.name}
                        </span>
                        <span className="w-1/2 text-lg truncate">
                          {expense.description.length > 20
                            ? `${expense.description.substring(0, 20)}...`
                            : expense.description}
                        </span>
                        <span
                          className={`w-1/4 text-lg text-right text-red-600`}
                        >
                          {expense.amount}
                        </span>
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
export default DailyLedger;
