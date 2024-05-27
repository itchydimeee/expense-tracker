import React from 'react'
import {
  screen,
  render,
  fireEvent,
  within
} from '@testing-library/react'
import MonthlySummaryCard from '@/components/monthlySummaryCard'
import { monthsArray } from '@/lib/types'

describe('MonthlySummaryCard', () => {
  let currentMonth = 4
  const currentYear = 2024
  const monthlyIncomeTotals = { '2024-05': 1000 }
  const monthlyExpenseTotals = { '2024-05': 500 }
  const monthlyProfitTotals = { '2024-05': 500 }
  const setCurrentMonth = jest.fn()
  const setCurrentYear = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

    it("renders the month and year", () => {
      const { getByText } = render(
        <MonthlySummaryCard
          currentMonth={currentMonth}
          currentYear={currentYear}
          monthlyIncomeTotals={monthlyIncomeTotals}
          monthlyExpenseTotals={monthlyExpenseTotals}
          monthlyProfitTotals={monthlyProfitTotals}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
        />
      );
      const monthName = monthsArray[currentMonth]
      const dateDisplay = `${monthName} ${currentYear}` //May 2024

      expect(getByText(dateDisplay)).toBeTruthy
    });

    it('renders the income, expense, and balance', () => {
      render(
            <MonthlySummaryCard
                currentMonth={currentMonth}
                currentYear={currentYear}
                monthlyIncomeTotals={monthlyIncomeTotals}
                monthlyExpenseTotals={monthlyExpenseTotals}
                monthlyProfitTotals={monthlyProfitTotals}
                setCurrentMonth={setCurrentMonth}
                setCurrentYear={setCurrentYear} />
        )
      const incomeElement = screen.getByTestId("monthly-income");
      const incomeH1 = within(incomeElement).getByRole('heading', { level: 1 });
      expect(incomeH1.textContent).toBe('Income');
      const incomeValue = within(incomeElement).getByText('1000.00');
      expect(incomeValue).toBeTruthy();

      const expenseElement = screen.getByTestId("monthly-expense");
      const expenseH1 = within(expenseElement).getByRole('heading', { level: 1 });
      expect(expenseH1.textContent).toBe('Expense');
      const expenseValue = within(expenseElement).getByText('500.00');
      expect(expenseValue).toBeTruthy();

      const balanceElement = screen.getByTestId("monthly-profit");
      const balanceH1 = within(balanceElement).getByRole('heading', { level: 1 });
      expect(balanceH1.textContent).toBe('Balance');
      const balanceValue = within(balanceElement).getByText('500.00');
      expect(balanceValue).toBeTruthy();
    })

  it('calls setCurrentMonth and setCurrentYear when previous month button is clicked', async () => {
    render(
      <MonthlySummaryCard
        currentMonth={currentMonth}
        currentYear={currentYear}
        monthlyIncomeTotals={monthlyIncomeTotals}
        monthlyExpenseTotals={monthlyExpenseTotals}
        monthlyProfitTotals={monthlyProfitTotals}
        setCurrentMonth={setCurrentMonth}
        setCurrentYear={setCurrentYear}
      />
    )

    const previousButton = screen.getByTestId('previous-button')
    fireEvent.click(previousButton)

    if (currentMonth === 0) {
      expect(setCurrentMonth).toHaveBeenCalledTimes(1)
      expect(setCurrentMonth).toHaveBeenCalledWith(11)
      expect(setCurrentYear).toHaveBeenCalledTimes(1)
      expect(setCurrentYear).toHaveBeenCalledWith(currentYear - 1)
    } else {
      expect(setCurrentMonth).toHaveBeenCalledTimes(1)
      expect(setCurrentMonth).toHaveBeenCalledWith(currentMonth - 1)
    }
  })

  it('calls setCurrentMonth and setCurrentYear when next month button is clicked', async () => {
    render(
      <MonthlySummaryCard
        currentMonth={currentMonth}
        currentYear={currentYear}
        monthlyIncomeTotals={monthlyIncomeTotals}
        monthlyExpenseTotals={monthlyExpenseTotals}
        monthlyProfitTotals={monthlyProfitTotals}
        setCurrentMonth={setCurrentMonth}
        setCurrentYear={setCurrentYear}
      />
    )
    const nextButton = screen.getByTestId('next-button')
    fireEvent.click(nextButton)

    if (currentMonth === 11) {
      expect(setCurrentMonth).toHaveBeenCalledTimes(1)
      expect(setCurrentMonth).toHaveBeenCalledWith(0)
      expect(setCurrentYear).toHaveBeenCalledTimes(1)
      expect(setCurrentYear).toHaveBeenCalledWith(currentYear + 1)
    } else {
      expect(setCurrentMonth).toHaveBeenCalledTimes(1)
      expect(setCurrentMonth).toHaveBeenCalledWith(currentMonth + 1)
    }
  })
})
