import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import ExpenseStats from "@/components/expenseStats";
import axios from "axios";
import { useUser } from "@auth0/nextjs-auth0/client";
import { act } from "react-dom/test-utils";

// Mock the axios module
jest.mock("axios");
jest.mock("@auth0/nextjs-auth0/client");

// Define the type for the mocked function
const mockedAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;

// Mock data
const mockUser = {
  email: "testuser@example.com",
};

const mockExpenses = [
  { category: { name: "Food" }, amount: 50 },
  { category: { name: "Transport" }, amount: 20 },
  { category: { name: "Bills" }, amount: 30 },
];

// Mock implementation of useUser
(useUser as jest.Mock).mockReturnValue({ user: mockUser });

// Mock implementation of axios
mockedAxiosGet.mockImplementation(async (url: string) => {
  if (url === "/api/fetchUser") {
    return { data: { id: "123" } };
  } else if (url === "/api/fetchExpenses") {
    return { data: mockExpenses };
  }
});

describe("ExpenseStats", () => {
  afterEach(() => {
    jest.clearAllMocks();
  }); // Clear mocks after each test

  it("renders loading state initially", async () => {
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
