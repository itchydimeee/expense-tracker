import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import ExpenseStats from "@/components/expenseStats";
import axios from "axios";
import { useUser } from "@auth0/nextjs-auth0/client";
import { act } from "react-dom/test-utils";

jest.mock("axios");
jest.mock("@auth0/nextjs-auth0/client");

const mockUser = {
  email: "testuser@example.com",
};

const mockExpenses = [
  { category: { name: "Food" }, amount: 50 },
  { category: { name: "Transport" }, amount: 20 },
  { category: { name: "Bills" }, amount: 30 },
];

(useUser as jest.Mock).mockReturnValue({ user: mockUser });

(axios.get as jest.Mock).mockImplementation((url: string) => {
  if (url === "/api/fetchUser") {
    return Promise.resolve({ data: { id: "123" } });
  } else if (url === "/api/fetchExpenses") {
    return Promise.resolve({ data: mockExpenses });
  }
});

describe("ExpenseStats", () => {
  afterEach(cleanup);

  it("renders loading state initially", () => {
    render(<ExpenseStats />);

    expect(
      screen.getAllByText("Loading Expense Statistics...").length
    ).toBeGreaterThan(0);
  });

  it("renders expense statistics after data is fetched", async () => {
    await act(async () => {
      render(<ExpenseStats />);
    });

    await waitFor(() =>
      expect(screen.getByText("Expense Statistics")).toBeInTheDocument()
    );

    expect(screen.getByText("Food - 50 (50%)")).toBeInTheDocument();
    expect(screen.getByText("Transport - 20 (20%)")).toBeInTheDocument();
    expect(screen.getByText("Bills - 30 (30%)")).toBeInTheDocument();
  });
});
