import { Expenses, Incomes } from './types'

export const combineTransactions = (
  incomes: Incomes[],
  expenses: Expenses[]
) => {
  const combinedIncomes: { [date: string]: Incomes[] } = {}
  const combinedExpenses: { [date: string]: Expenses[] } = {}

  incomes.forEach((income) => {
    const date = new Date(income.date)
    const dateString = date.toLocaleDateString()
    if (!combinedIncomes[dateString]) {
      combinedIncomes[dateString] = []
    }
    combinedIncomes[dateString].push(income)
  })

  expenses.forEach((expense) => {
    const date = new Date(expense.date)
    const dateString = date.toLocaleDateString()
    if (!combinedExpenses[dateString]) {
      combinedExpenses[dateString] = []
    }
    combinedExpenses[dateString].push(expense)
  })

  return { incomes: combinedIncomes, expenses: combinedExpenses }
}

export const calculateTotals = (
  incomes: { [date: string]: Incomes[] },
  expenses: { [date: string]: Expenses[] }
) => {
  const incomeTotals: { [date: string]: number } = {}
  const expenseTotals: { [date: string]: number } = {}

  Object.entries(incomes).forEach(([date, incomeList]) => {
    const incomeAmounts = incomeList.map((income) => Number(income.amount))
    const totalIncome = incomeAmounts.reduce((acc, curr) => acc + curr, 0)
    incomeTotals[date] = totalIncome
  })

  Object.entries(expenses).forEach(([date, expenseList]) => {
    const expenseAmounts = expenseList.map((expense) => Number(expense.amount))
    const totalExpense = expenseAmounts.reduce((acc, curr) => acc + curr, 0)
    expenseTotals[date] = totalExpense
  })

  return { incomeTotals, expenseTotals }
}
