import { Expenses, Incomes } from './types'

export const combineTransactions = (
  incomes: Incomes[],
  expenses: Expenses[]
) => {
  const combinedTransactions: {
    incomes: Record<string, Incomes[]>
    expenses: Record<string, Expenses[]>
  } = { incomes: {}, expenses: {} }
  incomes.forEach(income => {
    const date = new Date(income.date)
    const dateString = date.toLocaleDateString()
    if (!combinedTransactions.incomes[dateString]) {
      combinedTransactions.incomes[dateString] = []
    }
    combinedTransactions.incomes[dateString].push(income)
  })
  expenses.forEach(expense => {
    const date = new Date(expense.date)
    const dateString = date.toLocaleDateString()
    if (!combinedTransactions.expenses[dateString]) {
      combinedTransactions.expenses[dateString] = []
    }
    combinedTransactions.expenses[dateString].push(expense)
  })
  return combinedTransactions
}

export const calculateTotals = (
  incomes: { [x: string]: Incomes[] },
  expenses: { [x: string]: Expenses[] }
) => {
  const incomeTotals: { [date: string]: number } = {}
  const expenseTotals: { [date: string]: number } = {}
  const monthlyIncomeTotals: { [month: string]: number } = {}
  const monthlyExpenseTotals: { [month: string]: number } = {}
  const monthlyProfitTotals: { [month: string]: number } = {}

  Object.keys(incomes).forEach(date => {
    const incomeAmounts = incomes[date].map(income => Number(income.amount))
    const totalIncome = incomeAmounts.reduce((acc, curr) => acc + curr, 0)
    incomeTotals[date] = totalIncome

    const dateObj = new Date(date)
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const monthYear = `${year}-${month}`
    if (!monthlyIncomeTotals[monthYear]) {
      monthlyIncomeTotals[monthYear] = 0
    }
    monthlyIncomeTotals[monthYear] += totalIncome
  })

  Object.keys(expenses).forEach(date => {
    const expenseAmounts = expenses[date].map(expense => Number(expense.amount))
    const totalExpense = expenseAmounts.reduce((acc, curr) => acc + curr, 0)
    expenseTotals[date] = totalExpense

    const dateObj = new Date(date)
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const monthYear = `${year}-${month}`
    if (!monthlyExpenseTotals[monthYear]) {
      monthlyExpenseTotals[monthYear] = 0
    }
    monthlyExpenseTotals[monthYear] += totalExpense
  })

  const monthlyDates = [...Object.keys(monthlyIncomeTotals), ...Object.keys(monthlyExpenseTotals)]
  monthlyDates.forEach(monthYear => {
    monthlyProfitTotals[monthYear] = (monthlyIncomeTotals[monthYear] || 0) - (monthlyExpenseTotals[monthYear] || 0)
  })

  return {
    incomeTotals,
    expenseTotals,
    monthlyIncomeTotals,
    monthlyExpenseTotals,
    monthlyProfitTotals,
  }
}