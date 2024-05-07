import { useState, useEffect } from 'react';
import axios from 'axios';
import type { ExpenseCategories } from '@/lib/types';

interface ExpenseCategoryProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ExpenseCategory: React.FC<ExpenseCategoryProps> = ({ onChange }) => {
  const [categories, setCategories] = useState<ExpenseCategories[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/fetchCategories');
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <select onChange={onChange}>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
};

export default ExpenseCategory;