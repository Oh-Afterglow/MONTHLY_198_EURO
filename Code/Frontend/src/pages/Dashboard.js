import React from 'react';
import Grid from '@mui/material/Grid';
import Layout from '../components/Layout';
import NumberCard from '../components/NumberCard';
import PieChart from '../components/PieChart';
import request from '../utils/request';

const Dashboard = ({ projectName }) => {
  // TODO: Replace with some default data
  const [composeData, setComposeData] = React.useState([
    { name: 'Text', value: 100 },
    { name: 'Image', value: 200 },
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
      <Grid item container direction='column' xs={12} sm={4}>
        <NumberCard />
        <PieChart
          title={'Project Composition'}
          data={composeData}
          style={pieChartStyle}
        />
      </Grid>
      <Grid item container direction='column' xs={12} sm={4}></Grid>
      <Grid item container direction='column' xs={12} sm={4}></Grid>
    </Layout>
  );
};

export default Dashboard;
