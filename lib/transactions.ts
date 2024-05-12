import { Expenses, Incomes } from "./types"

export const combineTransactions = (incomes: Incomes[], expenses: Expenses[]) => {
    const combinedTransactions: { incomes: Record<string, Incomes[]>, expenses: Record<string, Expenses[]> } = { incomes: {}, expenses: {} }
    incomes.forEach((income) => {
      const date = new Date(income.date)
      const dateString = date.toLocaleDateString()
      if (!combinedTransactions.incomes[dateString]) {
        combinedTransactions.incomes[dateString] = []
      }
      combinedTransactions.incomes[dateString].push(income)
    })
    expenses.forEach((expense) => {
      const date = new Date(expense.date)
      const dateString = date.toLocaleDateString()
      if (!combinedTransactions.expenses[dateString]) {
        combinedTransactions.expenses[dateString] = []
      }
      combinedTransactions.expenses[dateString].push(expense)
    })
    return combinedTransactions
  }
  
  export const calculateTotals = (incomes: { [x: string]: Incomes[] }, expenses: { [x: string]: Expenses[] }) => {
    const incomeTotals: { [date: string]: number } = {}
    const expenseTotals: { [date: string]: number } = {}
  
    Object.keys(incomes).forEach((date) => {
      const incomeAmounts = incomes[date].map((income) => Number(income.amount))
      const totalIncome = incomeAmounts.reduce((acc, curr) => acc + curr, 0)
      incomeTotals[date] = totalIncome
    })
  
    Object.keys(expenses).forEach((date) => {
      const expenseAmounts = expenses[date].map((expense) => Number(expense.amount))
      const totalExpense = expenseAmounts.reduce((acc, curr) => acc + curr, 0)
      expenseTotals[date] = totalExpense
    })
  
    return { incomeTotals, expenseTotals }
  }