"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Expenses } from "@/lib/types";

function FetchExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isLoading } = useUser();
  const [editIndex, setEditIndex] = useState<number>(-1);

  const handleEdit = (index: number) => {
    setEditIndex(index);
  };

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
        const fetchUser = await axios.get("/api/fetchUser", {
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

  const handleSave = (index: number, updatedExpense: Expenses) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index] = updatedExpense;
    setExpenses(updatedExpenses);
    setEditIndex(-1);
  };

  const handleCancel = () => {
    setEditIndex(-1);
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
          expenses.map((expense: Expenses, index: number) => (
            <li
              key={expense.userId}
              className="flex justify-between py-4 border-b border-gray-200"
            >
              {editIndex === index ? (
                <EditExpenseForm
                  expense={expense}
                  onSave={(updatedExpense) => handleSave(index, updatedExpense)}
                  onCancel={handleCancel}
                />
              ) : (
                <>
                  <div>
                    <button
                      onClick={() => handleEdit(index)}
                      className="button-with-data"
                    >
                      <span className="text-lg amount">{expense.amount}</span>
                      <span className="text-lg amount">
                        {expense.description}
                      </span>
                      <span className="text-lg amount">
                        {expense.category.name}
                      </span>
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        ) : (
          <li>No expenses found.</li>
        )}
      </ul>
    </div>
  );
}

function EditExpenseForm({
  expense,
  onSave,
  onCancel,
}: {
  expense: Expenses;
  onSave: (updatedExpense: Expenses) => void;
  onCancel: () => void;
}) {
  const [editedExpense, setEditedExpense] = useState<Expenses>(expense);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedExpense({ ...editedExpense, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(editedExpense);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="description"
        value={editedExpense.description}
        onChange={handleChange}
      />
      <input
        type="number"
        name="amount"
        value={editedExpense.amount}
        onChange={handleChange}
      />
      <input
        type="text"
        name="category"
        value={editedExpense.category.name}
        onChange={handleChange}
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

export default FetchExpenses;
