import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Layout from '../components/Layout';
import NumberCard from '../components/NumberCard';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import request from '../utils/request';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import MemberTable from '../components/MemberTable';
import FormControlLabel from '@mui/material/FormControlLabel';

const Member = ({ projectName }) => {
  // TODO: Replace with some default data
  const [composeData, setComposeData] = React.useState([
    { name: 'Facebook', value: 50 },
    { name: 'Google', value: 20 },
    { name: 'Baidu', value: 10 },
    { name: 'ZJU', value: 10 },
  ]);



  React.useEffect(
    () => async () => {
      try {
        const data = await request.get('/project/compose', {
          projectName,
        });
        if (data instanceof Array) {
          setComposeData(data);
        } else {
          throw new Error('Invalid data');
        }
      } catch (e) {
        // TODO: handle error
        console.error(e);
      }
    },
    []
  );

  const pieChartStyle = {
    height: '50vh',
  };



  return (
    <Layout>
      <Grid item container direction='row' xs={12} sm={4}>
        <PieChart
          title={'Member from'}
          data={composeData}
          style={pieChartStyle}
        />
        <MemberTable />
      </Grid>
      <Grid item container direction='column' xs={12} sm={4}>
      
      </Grid>
      <Grid item container direction='column' xs={12} sm={4}>
       
      </Grid>
    </Layout>
  );
};

export default Member;
