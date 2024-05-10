import React from "react";
import axios from "axios";

interface Props {
  expenseId: string;
  onDelete: () => void;
}

const DeleteExpense: React.FC<Props> = ({ expenseId, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete("/api/deleteExpenses", { data: { id: expenseId } });
      onDelete();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2 mr-2"
    >
      Delete
    </button>
  );
};

export default DeleteExpense;
