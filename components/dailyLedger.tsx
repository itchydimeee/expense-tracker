"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

import { DailyLedgerProps, Incomes, Expenses, Expense } from "@/lib/types";
import { combineTransactions, calculateTotals } from "@/lib/transactions";

import MonthlySummaryCard from "./monthlySummaryCard";
import DailySummaryCard from "./dailySummaryCard";

export const DailyLedger: React.FC<DailyLedgerProps> = ({ userId }) => {
  const [incomes, setIncomes] = useState<{ [date: string]: Incomes[] }>({});
  const [expenses, setExpenses] = useState<{ [date: string]: Expenses[] }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      if (userId) {
        try {
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
    fetchTransactions();
  }, [userId]);

  const {
    incomeTotals,
    expenseTotals,
    monthlyIncomeTotals,
    monthlyExpenseTotals,
    monthlyProfitTotals,
  } = calculateTotals(incomes, expenses);

  const combinedTransactions = { ...incomes, ...expenses };

  const filteredDates = Object.keys(combinedTransactions).filter((date) => {
    const dateObject = new Date(date);
    return (
      dateObject.getMonth() === currentMonth &&
      dateObject.getFullYear() === currentYear
    );
  });

  return (
    <div className="max-w-md mx-auto p-2 pt-6 pb-8">
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          >
            <span className="sr-only">Loading transactions...</span>
          </div>
          <p className="text-lg text-gray-600 px-2">Loading transactions...</p>
        </div>
      )}
      <h2 className="">
        <MonthlySummaryCard
          data-testid="MonthlySummaryCard"
          currentMonth={currentMonth}
          currentYear={currentYear}
          monthlyIncomeTotals={monthlyIncomeTotals}
          monthlyExpenseTotals={monthlyExpenseTotals}
          monthlyProfitTotals={monthlyProfitTotals}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
        />
      </h2>
      <h1 className="text-2xl font-bold mb-2 mt-6 text-white">Daily Ledger</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <p>{error}</p>
        </div>
      )}
      <DailySummaryCard
        filteredDates={filteredDates}
        incomes={incomes}
        expenses={expenses}
        incomeTotals={incomeTotals}
        expenseTotals={expenseTotals}
      />
    </div>
  );
};

export default DailyLedger;
