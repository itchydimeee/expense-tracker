'use client';

import React, { useState, useEffect } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0/client';

const IncomeStats = () => {
  const [data, setData] = useState<
    { title: string; value: number; color: string }[]
  >([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const fetchUserIdAndIncomes = async () => {
        const response = await axios.get('/api/fetchUser', {
          params: {
            email: user.email,
          },
        });
        const userId = response.data.id;
        const responseIncomes = await axios.get('/api/fetchIncomes', {
          params: {
            userId,
          },
        });
        const incomes = responseIncomes.data;
        const incomeData: Map<string, number> = new Map<string, number>();

        incomes.forEach((income: { category: { name: any; }; amount: any; }) => {
          const categoryName = income?.category?.name!;
          const amount = Number(income?.amount!)
          if (categoryName && amount) {
            const data = incomeData ?? new Map<string, number>();
            if (data.has(categoryName)) {
              data.set(categoryName, data.get(categoryName) + amount);
            } else {
              data.set(categoryName, amount);
            }
          }
        });

        const data = Array.from(incomeData, ([title, value]) => ({
          title,
          value: Number(value),
          color: getRandomColor(),
        }));
        setData(data.sort((a, b) => b.value - a.value));
      };
      fetchUserIdAndIncomes();
    }
  }, [user]);

  const getRandomColor = () => {
    const colors = [
        '#FFC107',
        '#2196F3',
        '#9C27B0',
        '#4CAF50',
        '#FF69B4',
        '#8BC34A',
        '#03A9F4',
        '#E91E63',
      ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      className="p-2"
    >
      <h2 className="text-white text-xl font-semibold">
        Income Statistics
      </h2>
      <div className="w-full max-w-xs mx-auto">
        <PieChart
          data={data}
          radius={40}
          lineWidth={30}
          animate
        />
        <ul className="flex flex-wrap text-white text-xs justify-center mt-2">
          {data.map((item, index) => (
            <li key={index} className="mr-2 mb-2">
              <span
                style={{
                  backgroundColor: item.color,
                  width: '10px',
                  height: '10px',
                  display: 'inline-block',
                  marginRight: '10px',
                }}
              />
              <span>
                {item.title} - {item.value} ({Math.round((item.value / data.reduce((a, b) => a + b.value, 0)) * 100)}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default IncomeStats;