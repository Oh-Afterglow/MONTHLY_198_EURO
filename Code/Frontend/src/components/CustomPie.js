import React from 'react';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CustomPie = ({ data, width, height }) => {
  return (
    <>
      <PieChart {...{ width, height }}>
        <Pie data={data} isAnimationActive={false} dataKey='value' fill='#8884d8' label >
          {data.map((entry, index) => (
            <Cell fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </>
  );
};

export default CustomPie;
