import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import UpdateExpense from "@/components/updateExpense";

jest.mock("axios", () => ({
  put: jest.fn(() => Promise.resolve({ data: {} })),
}));

describe("UpdateExpense", () => {
  const expense = {
    id: "1",
    categoryId: "2",
    description: "Test description",
    amount: 10.99,
    userId: "123",
    user: {
      id: "userId123",
      auth0Id: "authId123",
      username: "wala nagana",
      email: "misaky@gmail.com",
      expenses: [],
    },
    date: new Date("2024-05-25"),
    category: { id: "categoryId123", name: "Transport", expenses: [] },
    type: "expenses" as "expenses",
  };

  const cancelEdit = jest.fn();

  it("submits the form with updated expense data", async () => {
    const { getByLabelText, getByTestId } = render(
      <UpdateExpense expense={expense} cancelEdit={cancelEdit} />
    );

    const dateInput = getByTestId("date-input");
    const categoryInput = getByTestId("expense-category");
    const descriptionInput = getByTestId("description");
    const amountInput = getByTestId("amount");
    const updateButton = getByTestId("updateExpense-button");

    fireEvent.change(dateInput, { target: { value: "2024-05-26" } });
    fireEvent.change(categoryInput, { target: { value: "3" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Updated description" },
    });
    fireEvent.change(amountInput, { target: { value: "20.99" } });

    fireEvent.click(updateButton);

    // Wait for update to complete
    await waitFor(() => {
      expect(cancelEdit).toHaveBeenCalled();
    });
  });

  it("cancels the update and calls cancelEdit", () => {
    const { getByTestId } = render(
      <UpdateExpense expense={expense} cancelEdit={cancelEdit} />
    );

    const cancelButton = getByTestId("update-cancel-button");

    fireEvent.click(cancelButton);

    expect(cancelEdit).toHaveBeenCalled();
  });
});
