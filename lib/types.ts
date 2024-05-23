export type Users = {
  id?: string
  auth0Id: string
  username: string
  email: string
  expenses: Expenses[]
  dailySummaries: DailySummaries[]
}

export type Expenses = {
  id?: string
  user: Users
  userId: string
  date: Date
  category: ExpenseCategories
  categoryId: string
  description: string
  amount: number
  dailySummaries: DailySummaries[]
  type: 'expenses'
}
export type Incomes = {
  id?: string
  user: Users
  userId: string
  date: Date
  category: ExpenseCategories
  categoryId: string
  description: string
  amount: number
  dailySummaries: DailySummaries[]
  type: 'income'
}

export type ExpenseCategories = {
  id?: string
  name: string
  expenses: Expenses[]
  dailySummaries: DailySummaries[]
}

export type IncomeCategories = {
  id?: string
  name: string
  expenses: Expenses[]
  dailySummaries: DailySummaries[]
}

export type DailySummaries = {
  id: string
  user: Users
  userId: string
  date: Date
  expense: Expenses
  expenseId: string
  category: ExpenseCategories
  categoryId: string
  totalExpense: number
}

export interface Expense {
  userId: string
  date: Date
  categoryId: string
  description: string
  amount: number
}
export interface Income {
  userId: string
  date: Date
  categoryId: string
  description: string
  amount: string
}

export interface UpdatedExpense {
  id: string | undefined
  categoryId: string
  description: string
  amount: number
  userId: string
}

export interface Transaction {
  id: string
  userId: string
  category: IncomeCategories | ExpenseCategories
  description: string
  amount: number
  date: Date
  type: 'income' | 'expense' // Use a union type for the type property
}

export interface DailySummaryCardProps {
  filteredDates: string[]
  incomes: { [date: string]: Incomes[] }
  expenses: { [date: string]: Expenses[] }
  incomeTotals: { [date: string]: number }
  expenseTotals: { [date: string]: number }
}

export interface MonthlySummaryCardProps {
  currentMonth: number
  currentYear: number
  monthlyIncomeTotals: { [date: string]: number }
  monthlyExpenseTotals: { [date: string]: number }
  monthlyProfitTotals: { [date: string]: number }
  setCurrentMonth: (month: number) => void
  setCurrentYear: (year: number) => void
}

export interface DailyLedgerProps {
  userId: string | null
}

export interface CreateExpenseFormProps {
  userId: string | null
  onClose: () => void
  onSubmit: (expense: Expense) => void
}

export interface createTransactionCardProps {
  userId: string | null
  onSubmitExpense: (expense: Expense) => void
  onSubmitIncome: (income: Income) => void
}

export const monthsArray = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const expenseCategoryMapping: { [key: string]: string } = {
  Education: '1',
  Transport: '2',
  Food: '3',
  Bills: '4',
  Health: '5',
  Clothing: '6',
  SocialLife: '7',
  Others: '8',
}
