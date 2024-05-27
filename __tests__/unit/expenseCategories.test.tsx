import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ExpenseCategory from "@/components/expenseCategories";
import axios from "axios";

jest.mock("axios");

const mockedAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;

const mockCategories = [
  { id: "1", name: "Food" },
  { id: "2", name: "Transport" },
];

describe("ExpenseCategory", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default option and categories", async () => {
    mockedAxiosGet.mockResolvedValueOnce({ data: mockCategories });

    await React.act(async () => {
      render(<ExpenseCategory onChange={() => {}} value="" />);
    });

    expect(screen.getByTestId("expense-category")).toBeInTheDocument();
    expect(screen.getByTestId("expense-category")).toHaveValue("");

    expect(screen.getByText("Select a category")).toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Transport")).toBeInTheDocument();
  });

  it("calls onChange when a category is selected", async () => {
    mockedAxiosGet.mockResolvedValueOnce({ data: mockCategories });
    const handleChange = jest.fn();

    await React.act(async () => {
      render(<ExpenseCategory onChange={handleChange} value="" />);
    });

    const select = screen.getByTestId("expense-category");
    fireEvent.change(select, { target: { value: "1" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it("calls onChange when a category is clicked", async () => {
    mockedAxiosGet.mockResolvedValueOnce({ data: mockCategories });
    const handleChange = jest.fn();

    await React.act(async () => {
      render(<ExpenseCategory onChange={handleChange} value="" />);
    });

    const select = screen.getByTestId("expense-category");
    const option = screen.getByText("Food");
    fireEvent.click(option);
    fireEvent.change(select, { target: { value: "1" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(expect.any(Object));
  });
  it("handles API error", async () => {
    const errorMessage = "Failed to fetch expense categories";
    mockedAxiosGet.mockRejectedValueOnce(new Error(errorMessage));

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await React.act(async () => {
      render(<ExpenseCategory onChange={() => {}} value="" />);
    });

    expect(screen.getByText("Select a category")).toBeInTheDocument();
    expect(screen.queryByText("Food")).not.toBeInTheDocument();
    expect(screen.queryByText("Transport")).not.toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith(new Error(errorMessage));

    consoleErrorSpy.mockRestore();
  });
});
