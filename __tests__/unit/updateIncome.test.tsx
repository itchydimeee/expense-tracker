import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import UpdateIncome from "@/components/updateIncome";
import axios from "axios";
import { Incomes } from "@/lib/types";

jest.mock("axios");

describe("UpdateIncome", () => {
  const income: Incomes = {
    id: "1",
    categoryId: "2",
    description: "Test description",
    amount: 10.99,
    userId: "123",
    user: {
      id: "userId123",
      auth0Id: "authId123",
      username: "hot dog",
      email: "misaky@gmail.com",
      incomes: [],
    },
    date: new Date("2024-05-25"),
    category: { id: "categoryId123", name: "Salary", incomes: [] },
    type: "income",
  };
  const cancelEdit = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls handleSubmit when the form is submitted", async () => {
    (axios.put as jest.Mock).mockResolvedValueOnce({});

    const { getByText } = render(
      <UpdateIncome income={income} cancelEdit={cancelEdit} />
    );

    const updateButton = getByText("Update Income");

    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith("/api/updateIncomes", income);
    });
  });

  it("handles update error gracefully", async () => {
    (axios.put as jest.Mock).mockRejectedValueOnce(new Error("Update failed"));

    const { getByText } = render(
      <UpdateIncome income={income} cancelEdit={cancelEdit} />
    );

    const updateButton = getByText("Update Income");

    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith("/api/updateIncomes", income);
    });
  });

  it("calls cancelEdit when the cancel button is clicked", () => {
    const { getByText } = render(
      <UpdateIncome income={income} cancelEdit={cancelEdit} />
    );

    const cancelButton = getByText("Cancel");

    fireEvent.click(cancelButton);

    expect(cancelEdit).toHaveBeenCalledTimes(1);
  });
});
