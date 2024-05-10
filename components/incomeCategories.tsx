import { useState, useEffect } from 'react';
import axios from 'axios';
import type { IncomeCategories } from '@/lib/types';

interface IncomeCategoryProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
}

const IncomeCategory: React.FC<IncomeCategoryProps> = ({ onChange, value }) => {
  const [categories, setCategories] = useState<IncomeCategories[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/fetchIncomeCategories');
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <select value={value} onChange={onChange} className='rounded-xl bg-gray-300 text-black px-2 py-1 ml-2'>
      <option value="">Select a category</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
};

export default IncomeCategory;