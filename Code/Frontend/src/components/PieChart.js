import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { Charts } from '@jiaminghi/data-view-react';
import CustomPie from '../components/CustomPie';

export default function PieChart({ title, data, style }) {
  const option = {
    title: { text: title },
    series: [
      {
        type: 'pie',
        data,
        radius: ['40%', '50%'],
        insideLabel: { show: true },
      },
    ],
  };

  const mnp = {
    margin: '1rem 0 1rem',
    padding: '1rem',
  };

  return (
    <Grid item>
      <Card style={{ ...style, ...mnp }}>
        <Charts option={option} height='100%' />
      </Card>
    </Grid>
  );
}
