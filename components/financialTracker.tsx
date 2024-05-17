'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useUser } from '@auth0/nextjs-auth0/client'
import {
  Users,
  Expenses,
  Income,
  ExpenseCategories,
  IncomeCategories,
  DailySummaries,
} from '@prisma/client'

function FinancialTracker() {
  const { user, isLoading } = useUser()
  const [expenses, setExpenses] = useState<Expenses[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])
  const []
}

export default FinancialTracker
