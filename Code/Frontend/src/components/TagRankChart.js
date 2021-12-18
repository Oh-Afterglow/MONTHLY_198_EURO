import React from 'react';
import { ScrollRankingBoard } from '@jiaminghi/data-view-react';

const TagRankChart = ({ data, style }) => {
  const config = { data };

  const chartStyle = {
    width: '80%',
    margin: 'auto',
    color: '#1976d2',
  };

  return (
    <ScrollRankingBoard config={config} style={{ ...style, ...chartStyle }} />
  );
};

export default TagRankChart;
