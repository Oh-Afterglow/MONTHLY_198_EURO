import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Charts } from '@jiaminghi/data-view-react';

export default function BarChart({ title, xname, value, yname, style }) {
  let option = {
    title: {
      text: title,
    },
    xAxis: {
      name: xname,
      data:['Week', 'Month', 'HalfYear', 'Year', 'Never'],
    },
    yAxis: {
      name: yname,
      data: 'value',
      min : 0
    },
    series: [
      {
        data: value,
        type: 'bar',
        stack: 'a',
        label: {
          show: true,
          position: 'center',
          offset: [0, 0],
          style: {
            fill: '#fff',
          },
        },
      },   
    ],
  };


  const mnp = {
    margin: '1rem 0 1rem',
    padding: '1rem',
  };

  return (
    <Grid item>
      <Box style={{ ...style, ...mnp }}>
       <Charts option={option} height='100%' /> 
      </Box>
    </Grid>
  );
}
