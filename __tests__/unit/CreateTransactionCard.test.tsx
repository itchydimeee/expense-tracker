import React from "react";
import "@testing-library/jest-dom";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import CreateTransactionCard from "@/components/createTransactionCard";

describe("CreateTransactionCard", () => {
  const userId = "123";
  const onSubmitExpense = jest.fn();
  const onSubmitIncome = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the create transaction button", () => {
    render(
      <CreateTransactionCard
        userId={userId}
        onSubmitExpense={onSubmitExpense}
        onSubmitIncome={onSubmitIncome}
      />
    );

    expect(screen.getByTestId("create-button")).toBeInTheDocument();
  });

  it("displays the form when the button is clicked", () => {
    render(
      <CreateTransactionCard
        userId={userId}
        onSubmitExpense={onSubmitExpense}
        onSubmitIncome={onSubmitIncome}
      />
    );

    fireEvent.click(screen.getByTestId("create-button"));

    expect(screen.getByTestId("expense-button")).toBeInTheDocument();
    expect(screen.getByTestId("income-button")).toBeInTheDocument();
  });

  it("switches between Expense and Income forms", () => {
    render(
      <CreateTransactionCard
        userId={userId}
        onSubmitExpense={onSubmitExpense}
        onSubmitIncome={onSubmitIncome}
      />
    );

    fireEvent.click(screen.getByTestId("create-button"));

    const expenseButton = screen.getByTestId("expense-button");
    const incomeButton = screen.getByTestId("income-button");

    expect(expenseButton).toHaveClass("bg-white text-black");
    expect(incomeButton).toHaveClass("bg-transparent text-white");

    fireEvent.click(incomeButton);

    expect(expenseButton).toHaveClass("bg-transparent text-white");
    expect(incomeButton).toHaveClass("bg-white text-black");
  });

  it("calls onSubmitExpense with correct data when Expense form is submitted", async () => {
    render(
      <CreateTransactionCard
        userId={userId}
        onSubmitExpense={onSubmitExpense}
        onSubmitIncome={onSubmitIncome}
      />
    );

    fireEvent.click(screen.getByTestId("create-button"));

    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2024-05-25" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "Category" }), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test description" },
    });
    fireEvent.change(screen.getByLabelText("Amount"), {
      target: { value: "10.99" },
    });

    fireEvent.click(screen.getByText("Create Expense"));

    await waitFor(() => expect(onSubmitExpense).toHaveBeenCalledTimes(1));
    expect(onSubmitExpense).toHaveBeenCalledWith({
      userId: "123",
      date: new Date("2024-05-25"),
      categoryId: "1",
      description: "Test description",
      amount: 10.99,
    });
  });

  it("calls onSubmitIncome with correct data when Income form is submitted", async () => {
    render(
      <CreateTransactionCard
        userId={userId}
        onSubmitExpense={onSubmitExpense}
        onSubmitIncome={onSubmitIncome}
      />
    );

    fireEvent.click(screen.getByTestId("create-button"));
    fireEvent.click(screen.getByTestId("income-button"));

    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2024-05-25" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "Category" }), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test description" },
    });
    fireEvent.change(screen.getByLabelText("Amount"), {
      target: { value: "500.00" },
    });

    fireEvent.click(screen.getByText("Create Income"));

    await waitFor(() => expect(onSubmitIncome).toHaveBeenCalledTimes(1));
    expect(onSubmitIncome).toHaveBeenCalledWith({
      userId: "123",
      date: new Date("2024-05-25"),
      categoryId: "1",
      description: "Test description",
      amount: 500.0,
    });
  });
});
