import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const CustomLine = ({ data, width, height }) => {
  return (
    <LineChart
      {...{ width, height: Math.trunc(height * 0.5) }}
      style={{ marginTop: '25%' }}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='name' />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type='monotone' dataKey='value' stroke='#8884d8' />
    </LineChart>
  );
};

export default CustomLine;
