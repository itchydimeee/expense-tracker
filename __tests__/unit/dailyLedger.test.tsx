import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { act } from "react-dom/test-utils";

import DailyLedger from "@/components/dailyLedger";
import { DailyLedgerProps } from "@/lib/types";

// Mock the axios module
jest.mock("axios");

// Define the type for the mocked function
const mockedAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;

// Mock data
const mockIncomes = {
  "2023-05-01": [
    {
      id: "1",
      amount: 1000,
      date: "2023-05-01",
      category: "Salary",
      userId: "1",
    },
  ],
};
const mockExpenses = {
  "2023-05-01": [
    { id: "1", amount: 200, date: "2023-05-01", category: "Food", userId: "1" },
  ],
};

describe("DailyLedger", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    mockedAxiosGet.mockResolvedValueOnce({ data: {} });

    await act(async () => {
      render(<DailyLedger userId="1" />);
    });

    expect(screen.getByText("Loading transactions...")).toBeInTheDocument();
  });

  it("renders correctly with data", async () => {
    mockedAxiosGet.mockResolvedValueOnce({ data: mockIncomes });
    mockedAxiosGet.mockResolvedValueOnce({ data: mockExpenses });

    await act(async () => {
      render(<DailyLedger userId="1" />);
    });

    await waitFor(() =>
      expect(screen.getByText("Daily Ledger")).toBeInTheDocument()
    );

    expect(screen.getByText("Daily Ledger")).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();
  });

  it("handles API error", async () => {
    const errorMessage = "Failed to fetch transactions";
    mockedAxiosGet.mockRejectedValueOnce(new Error(errorMessage));

    await act(async () => {
      render(<DailyLedger userId="1" />);
    });

    await waitFor(() =>
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    );
  });
});
