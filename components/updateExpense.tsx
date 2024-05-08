"use client";

import React, { useState } from "react";
import axios from "axios";
import { Expense } from "@/lib/types";

interface Props {
  expense: Expense;
  fetchExpenses: () => void;
}

const UpdateExpenses: React.FC<Props> = ({ expense, fetchExpenses }) => {
  const [editedExpense, setEditedExpense] = useState(expense);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedExpense({ ...editedExpense, [name]: value });
  };

  const updateExpense = async () => {
    try {
      await axios.put(
        `/api/updateExpense/${expense.categoryId}`,
        editedExpense
      );
      fetchExpenses();
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        name="description"
        value={editedExpense.description}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="amount"
        value={editedExpense.amount}
        onChange={handleInputChange}
      />
      <button onClick={updateExpense}>Save</button>
    </div>
  );
};

export default UpdateExpenses;
