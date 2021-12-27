import React from 'react';
import { PieChart, Pie } from 'recharts';

const CustomPie = ({ data, width, height }) => {
  return (
    <>
      <PieChart {...{ width, height }}>
        <Pie data={data} dataKey='value' fill='#8884d8' label />
      </PieChart>
    </>
  );
};

export default CustomPie;
