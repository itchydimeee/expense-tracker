import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import DailySummaryCard from "@/components/dailySummaryCard";
import { Incomes, Expenses } from "@/lib/types";

describe("DailySummaryCard", () => {
  const filteredDates = ["2024-05-25", "2024-05-26"];
  const incomes: { [date: string]: Incomes[] } = {
    "2024-05-25": [
      {
        id: "1",
        user: {
          id: "user-1",
          username: "User 1",
          email: "user1@example.com",
          auth0Id: "user-1",
        },
        userId: "1",
        date: new Date("2024-05-25"),
        categoryId: "1",
        category: {
          name: "Income Category 1",
        },
        description: "Income description 1",
        amount: 100,
        type: "income",
      },
      {
        id: "2",
        user: {
          id: "user-1",
          username: "User 1",
          email: "user1@example.com",
          auth0Id: "user-1",
        },
        userId: "1",
        date: new Date("2024-05-25"),
        categoryId: "2",
        category: {
          name: "Income Category 2",
        },
        description: "Income description truncate sample",
        amount: 200,
        type: "income",
      },
    ],
    "2024-05-26": [
      {
        id: "3",
        user: {
          id: "user-1",
          username: "User 1",
          email: "user1@example.com",
          auth0Id: "user-1",
        },
        userId: "1",
        date: new Date("2024-05-25"),
        categoryId: "3",
        category: {
          name: "Income Category 3",
        },
        description: "Income description 3",
        amount: 300,
        type: "income",
      },
    ],
  };
  const expenses: { [date: string]: Expenses[] } = {
    "2024-05-25": [
      {
        id: "1",
        user: {
          id: "user-1",
          username: "User 1",
          email: "user1@example.com",
          auth0Id: "user-1",
        },
        userId: "1",
        date: new Date("2024-05-25"),
        categoryId: "4",
        category: {
          name: "Expense Category 1",
        },
        description: "Expense 1",
        amount: 50,
        type: "expenses",
      },
      {
        id: "2",
        user: {
          id: "user-1",
          username: "User 1",
          email: "user1@example.com",
          auth0Id: "user-1",
        },
        userId: "1",
        date: new Date("2024-05-25"),
        categoryId: "5",
        category: {
          name: "Expense Category 2",
        },
        description: "Expense 2",
        amount: 75,
        type: "expenses",
      },
    ],
    "2024-05-26": [
      {
        id: "3",
        user: {
          id: "user-1",
          username: "User 1",
          email: "user1@example.com",
          auth0Id: "user-1",
        },
        userId: "1",
        date: new Date("2024-05-26"),
        categoryId: "6",
        category: {
          name: "Expense Category 3",
        },
        description: "Expense description 3",
        amount: 100,
        type: "expenses",
      },
    ],
  };
  const incomeTotals = {
    "2024-05-25": 300,
    "2024-05-26": 300,
  };
  const expenseTotals = {
    "2024-05-25": 125,
    "2024-05-26": 100,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the daily summary card", () => {
    const { getByText } = render(
      <DailySummaryCard
        filteredDates={filteredDates}
        incomes={incomes}
        expenses={expenses}
        incomeTotals={incomeTotals}
        expenseTotals={expenseTotals}
      />
    );

    expect(screen.getAllByTestId("daily-summary-card")).toHaveLength(2);
    expect(screen.getAllByTestId("day-of-month")).toHaveLength(2);
    expect(screen.getAllByTestId("day-of-week")).toHaveLength(2);
    expect(screen.getAllByTestId("income-total")).toHaveLength(2);
    expect(screen.getAllByTestId("expense-total")).toHaveLength(2);

    expect(getByText("25")).toBeTruthy;
    expect(getByText("Sat")).toBeTruthy;
    expect(getByText("26")).toBeTruthy;
    expect(getByText("Sun")).toBeTruthy;
  });
  it("renders UpdateIncome component when income item is clicked", () => {
    const { getByText } = render(
      <DailySummaryCard
        filteredDates={filteredDates}
        incomes={incomes}
        expenses={expenses}
        incomeTotals={incomeTotals}
        expenseTotals={expenseTotals}
      />
    );

    const incomeItem = getByText("Income description 1");
    fireEvent.click(incomeItem);

    expect(getByText("Update Income")).toBeTruthy;
  });
  it("renders incomes with more than 20 characters", () => {
    const { getByText } = render(
      <DailySummaryCard
        filteredDates={filteredDates}
        incomes={incomes}
        expenses={expenses}
        incomeTotals={incomeTotals}
        expenseTotals={expenseTotals}
      />
    );
    expect(getByText("Income description t...")).toBeTruthy;
  });

  it("renders UpdateExpense component when expense item is clicked", () => {
    const { getByText } = render(
      <DailySummaryCard
        filteredDates={filteredDates}
        incomes={incomes}
        expenses={expenses}
        incomeTotals={incomeTotals}
        expenseTotals={expenseTotals}
      />
    );
    const expenseItem = getByText("Expense 1");
    fireEvent.click(expenseItem);
    expect(getByText("Update Expense")).toBeTruthy;
  });
  it("renders expenses with more than 20 characters", () => {
    const { getByText } = render(
      <DailySummaryCard
        filteredDates={filteredDates}
        incomes={incomes}
        expenses={expenses}
        incomeTotals={incomeTotals}
        expenseTotals={expenseTotals}
      />
    );
    expect(getByText("Expense description ...")).toBeTruthy;
  });
});
