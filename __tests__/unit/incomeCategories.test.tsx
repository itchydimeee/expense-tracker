import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import IncomeCategory from "@/components/incomeCategories";
import axios from "axios";
import { act } from "react";

jest.mock("axios");

const mockedAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;

const mockCategories = [
  { id: "1", name: "Salary" },
  { id: "2", name: "Business" },
];

describe("IncomeCategory", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default option and categories", async () => {
    mockedAxiosGet.mockResolvedValueOnce({ data: mockCategories });

    await act(async () => {
      render(<IncomeCategory onChange={() => {}} value="" />);
    });

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveValue("");

    expect(screen.getByText("Select a category")).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.getByText("Business")).toBeInTheDocument();
  });

  it("calls onChange when a category is selected", async () => {
    mockedAxiosGet.mockResolvedValueOnce({ data: mockCategories });
    const handleChange = jest.fn();

    await act(async () => {
      render(<IncomeCategory onChange={handleChange} value="" />);
    });

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "1" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it("handles API error", async () => {
    const errorMessage = "Failed to fetch income categories";
    mockedAxiosGet.mockRejectedValueOnce(new Error(errorMessage));

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await act(async () => {
      render(<IncomeCategory onChange={() => {}} value="" />);
    });

    expect(screen.getByText("Select a category")).toBeInTheDocument();
    expect(screen.queryByText("Salary")).not.toBeInTheDocument();
    expect(screen.queryByText("Business")).not.toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith(new Error(errorMessage));

    consoleErrorSpy.mockRestore();
  });
});
