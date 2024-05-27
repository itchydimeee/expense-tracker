import React from "react";
import { render, fireEvent, waitFor, getByText } from "@testing-library/react";
import UpdateExpense from "@/components/updateExpense";
import axios from "axios";
import { Expenses } from "@/lib/types";

jest.mock("axios");

describe("UpdateExpense", () => {
  const expense: Expenses = {
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
    },
    date: new Date("2024-05-25"),
    category: { id: "categoryId123", name: "Transport" },
    type: "expenses",
  };

  const wrongExpense: Expenses = {
    id: "1",
    categoryId: "2",
    description: "Test description",
    amount: 0,
    userId: "123",
    user: {
      id: "userId123",
      auth0Id: "authId123",
      username: "wala nagana",
      email: "misaky@gmail.com",
    },
    date: new Date("2024-05-25"),
    category: { id: "categoryId123", name: "Transport" },
    type: "expenses",
  };
  const cancelEdit = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls handleSubmit when the form is submitted", async () => {
    (axios.put as jest.Mock).mockResolvedValueOnce({});

    const { getByTestId } = render(
      <UpdateExpense expense={expense} cancelEdit={cancelEdit} />
    );

    const updateButton = getByTestId("updateExpense-button");

    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith("/api/updateExpenses", expense);
    });
  });

  it("handles update error gracefully", async () => {
    (axios.put as jest.Mock).mockRejectedValueOnce(new Error("Update failed"));

    const { getByTestId } = render(
      <UpdateExpense expense={expense} cancelEdit={cancelEdit} />
    );

    const updateButton = getByTestId("updateExpense-button");

    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith("/api/updateExpenses", expense);
    });
  });

  it("calls cancelEdit when the cancel button is clicked", () => {
    const { getByTestId } = render(
      <UpdateExpense expense={expense} cancelEdit={cancelEdit} />
    );

    const cancelButton = getByTestId("update-cancel-button");

    fireEvent.click(cancelButton);

    expect(cancelEdit).toHaveBeenCalledTimes(1);
  });

  it("calls handleSubmit when the form is submitted", async () => {
    (axios.put as jest.Mock).mockResolvedValueOnce({});

    const { getByTestId } = render(
      <UpdateExpense expense={expense} cancelEdit={cancelEdit} />
    );

    const updateButton = getByTestId("updateExpense-button");

    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith("/api/updateExpenses", expense);
    });
  });

  it("does not submit the form if the amount field is not filled out", async () => {
    (axios.put as jest.Mock).mockResolvedValueOnce({});

    const { getByTestId, getByText } = render(
      <UpdateExpense expense={wrongExpense} cancelEdit={cancelEdit} />
    );

    const updateButton = getByTestId("updateExpense-button");

    fireEvent.click(updateButton);

    await waitFor(
      () =>
        expect(getByText("Please fill in all necessary fields"))
          .toBeInTheDocument
    );
  });
});
