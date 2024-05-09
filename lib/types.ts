export type Users = {
  id?: string;
  auth0Id: string;
  username: string;
  email: string;
  expenses: Expenses[];
  dailySummaries: DailySummaries[];
};

export type Expenses = {
  id?: string;
  user: Users;
  userId: string;
  date: Date;
  category: ExpenseCategories;
  categoryId: string;
  description: string;
  amount: number;
  dailySummaries: DailySummaries[];
};
export type Incomes = {
  id?: string;
  user: Users;
  userId: string;
  date: Date;
  category: ExpenseCategories;
  categoryId: string;
  description: string;
  amount: number;
  dailySummaries: DailySummaries[];
};

export type ExpenseCategories = {
  id?: string;
  name: string;
  expenses: Expenses[];
  dailySummaries: DailySummaries[];
};
export type IncomeCategories = {
  id?: string;
  name: string;
  expenses: Expenses[];
  dailySummaries: DailySummaries[];
};

export type DailySummaries = {
  id: string;
  user: Users;
  userId: string;
  date: Date;
  expense: Expenses;
  expenseId: string;
  category: ExpenseCategories;
  categoryId: string;
  totalExpense: number;
};

export interface Expense {
  userId: any;
  name: string;
  categoryId: string;
  description: string;
  amount: string;
}
export interface Income {
  userId: any;
  name: string;
  categoryId: string;
  description: string;
  amount: string;
}

export interface UpdatedExpense {
  id: string | undefined;
  categoryId: string;
  description: string;
  amount: number;
  userId: string;
}
