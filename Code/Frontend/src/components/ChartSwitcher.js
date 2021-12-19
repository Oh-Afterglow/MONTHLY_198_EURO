import React, { useState } from 'react';
import { Card, Switch, Box } from '@mui/material';

const ChartSwitcher = ({ chart0, chart1 }) => {
  const [chart, setChart] = useState(true);

  const handleChange = () => setChart(!chart);

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '1rem 0 1rem'
  };

  return (
    <Card style={cardStyle}>
      <Box style={{ width: '100%' }}>
        <div style={{ textAlign: 'right' }}>
          <Switch checked={chart} onChange={handleChange} />
        </div>
        {chart ? chart0 : chart1}
      </Box>
    </Card>
  );
};

export default ChartSwitcher;
