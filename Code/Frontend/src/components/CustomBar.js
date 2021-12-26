import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const CustomBar = ({ data, width, height }) => {
  return (
    <BarChart
      {...{ width, height: Math.trunc(height * 0.5) }}
      style={{ marginTop: '25%' }}
      data={data}
    >
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='name' />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey='value' fill='#8884d8' />
    </BarChart>
  );
};

export default CustomBar;
