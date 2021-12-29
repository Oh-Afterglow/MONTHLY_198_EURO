import React from 'react';
import { ScrollRankingBoard } from '@jiaminghi/data-view-react';
import Typography from "@mui/material/Typography";

const TagRankChart = ({ data, style }) => {
  const config = { data };

  const chartStyle = {
    width: '80%',
    margin: 'auto',
    color: '#778899',
  };

  return (
    <div>
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
        style={{ display: 'flex',flexDirection: 'column',justifyContent: 'center',alignItems: 'center',margin: '1rem'}}
      >
         Label Statistics of Commit
      </Typography>
      
      <ScrollRankingBoard config={config} style={{ ...style, ...chartStyle }} />
    </div>
  );
};

export default TagRankChart;
