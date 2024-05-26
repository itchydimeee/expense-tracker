import { useState, FormEvent } from "react";
import axios from "axios";
import IncomeCategory from "./incomeCategories";

import { Incomes } from "@/lib/types";
import DeleteIncome from "./deleteIncome";

function UpdateIncome({
  income,
  cancelEdit,
}: {
  income: Incomes;
  cancelEdit: () => void;
}) {
  const [updatedIncome, setUpdatedIncome] = useState<Incomes>({
    id: income.id,
    categoryId: income.categoryId,
    description: income.description,
    amount: income.amount,
    userId: income.userId,
    user: income.user,
    date: new Date(income.date),
    category: income.category,
    type: "income",
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "amount" && parseFloat(value) <= 0) {
      setError("Invalid amount");
      return;
    }
    setUpdatedIncome({ ...updatedIncome, [name]: value });
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setUpdatedIncome({ ...updatedIncome, categoryId: event.target.value });
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedIncome({ ...updatedIncome, date: new Date(event.target.value) });
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (!updatedIncome.amount) {
      setError("Please fill in all necessary fields");
      return;
    }

    try {
      console.log("Updating income: ", updatedIncome);
      const response = await axios.put("/api/updateIncomes", updatedIncome);

      if (response.data.error) {
        console.error("Failed to update income:", response.data.error);
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating income:", error);
    }
  };

  return (
    <div className="fixed z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-[380px] min-h-fit px-6 pb-4 bg-gradient-to-br from-[#4D4D4D] to-[#666666] rounded-2xl shadow-lg border-none">
      <div className="flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="max-w-md w-full text-white font-semibold"
        >
          <label className="block mt-2">Date</label>
          <input
            className="shadow appearance-none border rounded py-2 px-6 font-normal text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            type="date"
            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
            value={updatedIncome.date.toISOString().slice(0, 10)} // Update this line
            onChange={handleDateChange}
          />
          <label className="block mt-2">Category</label>
          <IncomeCategory
            onChange={handleCategoryChange}
            value={updatedIncome.categoryId}
          />
          <label className="block mt-2">
            Description
            <input
              type="text"
              name="description"
              value={updatedIncome.description}
              onChange={handleInputChange}
              className="w-full p-2 pl-4 text-sm rounded text-gray-700"
            />
          </label>
          <label className="block mt-2">
            Amount
            <input
              id="update-amount"
              type='number'
              name='amount'
              value={updatedIncome.amount}
              onChange={handleInputChange}
              className="w-full p-2 pl-4 text-sm rounded text-gray-700"
            />
          </label>
          {error && (
            <div className="text-red-300 font-normal text-base mb-2 mt-2">
              {error}
            </div>
          )}
          <div className="flex justify-between mt-4 text-sm pl-3">
            <button
              id="update-button"
              date-testid="updateIncome-button"
              type="submit"
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-3 rounded"
            >
              Update Income
            </button>
            <div className="flex justify-end">
              <DeleteIncome incomeId={income.id || ""} onDelete={cancelEdit} />
              <button
                date-testid="updateIncome-cancel-button"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateIncome;
