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
    <div>
      <h3 style={{ display: 'flex',flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}}>
        Label Statistics of Commit
      </h3>
      <ScrollRankingBoard config={config} style={{ ...style, ...chartStyle }} />
    </div>
  );
};

export default TagRankChart;
