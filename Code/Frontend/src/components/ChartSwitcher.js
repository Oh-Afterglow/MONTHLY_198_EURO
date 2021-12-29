import React, { useState } from 'react';
import { Card, Switch, Box } from '@mui/material';
import Typography from "@mui/material/Typography";


const ChartSwitcher = ({ chart0, chart1,style,name,name1 }) => {
  const [chart, setChart] = useState(true);

  const handleChange = () => setChart(!chart);

  

  return (
    <Card style={style}>
      <Box style={{ width: '100%' }}>
        <div style={{ textAlign: 'right' }}>
          <Switch checked={chart} onChange={handleChange} />
        </div>
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
          style={{ display: 'flex',flexDirection: 'column',justifyContent: 'center',alignItems: 'center',margin: '1rem'}}
        >
          {chart?name:name1}
        </Typography>
        {chart ? chart0 : chart1}
      </Box>
    </Card>
  );
};

export default ChartSwitcher;
