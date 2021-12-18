import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Layout from '../components/Layout';
import NumberCard from '../components/NumberCard';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import request from '../utils/request';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import ProjectTable from '../components/ProjectTable';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Card } from '@mui/material';
import ChartSwitcher from '../components/ChartSwitcher';
import TagRankChart from '../components/TagRankChart';

const Dashboard = ({ projectName }) => {
  // TODO: Replace with some default data
  const [composeData, setComposeData] = React.useState([
    { name: 'Text', value: 100 },
    { name: 'Image', value: 200 },
  ]);

  const [choosemode, setchoosemode] = useState(0);
  //为了降低代码量，这里使用的格式比较蠢，想的是后端把这里都返回过来，然后改图表粒度的时候就可以简单点
  const [commit, setcommit] = React.useState([
    {
      name: '0',
      value: [
        //只有第一行的value有用,别的随意
        {
          name: 'X',
          value: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
        },
        { name: 'mon', value: [10, 20, 30, 40, 50, 60, 70] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
      ],
    },
    {
      name: '1',
      value: [
        //这里的都需要用，具体格式是每一列的数字代表一周
        { name: 'X', value: ['week1', 'week2', 'week3', 'week4'] },
        { name: '1', value: [10, 20, 30, 40] },
        { name: '2', value: [60, 20, 30, 40] },
        { name: '3', value: [50, 20, 30, 40] },
        { name: '4', value: [30, 20, 20, 40] },
        { name: '5', value: [30, 20, 30, 40] },
        { name: '6', value: [30, 20, 20, 40] },
        { name: '7', value: [30, 20, 30, 40] },
      ],
    },
    {
      name: '2',
      value: [
        //这里的都需要用，具体格式是每一列的数字代表一月
        {
          name: 'X',
          value: ['month1', 'month2', 'month3', 'month4', 'month5', 'month6'],
        },
        { name: '1', value: [10, 20, 30, 40, 50, 60] },
        { name: '2', value: [10, 20, 30, 40, 50, 60] },
        { name: '3', value: [10, 20, 30, 40, 50, 60] },
        { name: '4', value: [10, 20, 30, 40, 50, 60] },
        { value: [] },
        { value: [] },
        { value: [] },
      ],
    },
  ]);

  const [commitdifference, setcommitdifference] = React.useState([
    {
      name: '0',
      value: [
        //只有第一行的value有用,别的随意
        {
          name: 'X',
          value: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        },
        { name: 'mon', value: [0, 0, 0, 0, 0, 0, 0] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
      ],
    },
    {
      name: '1',
      value: [
        //这里的都需要用，具体格式是每一列的数字代表一周
        { name: 'X', value: ['week1', 'week2', 'week3', 'week4'] },
        { name: '1', value: [0, 0, 0, 0] },
        { name: '2', value: [0, 0, 0, 0] },
        { name: '3', value: [0, 0, 0, 0] },
        { name: '4', value: [0, 0, 0, 0] },
        { name: '5', value: [0, 0, 0, 0] },
        { name: '6', value: [0, 0, 0, 0] },
        { name: '7', value: [0, 0, 0, 0] },
      ],
    },
    {
      name: '2',
      value: [
        //这里的都需要用，具体格式是每一列的数字代表一月
        {
          name: 'X',
          value: ['month1', 'month2', 'month3', 'month4', 'month5', 'month6'],
        },
        { name: '1', value: [0, 0, 0, 0, 0, 0] },
        { name: '2', value: [0, 0, 0, 0, 0, 0] },
        { name: '3', value: [0, 0, 0, 0, 0, 0] },
        { name: '4', value: [0, 0, 0, 0, 0, 0] },
        { value: [] },
        { value: [] },
        { value: [] },
      ],
    },
  ]);
  
  const [issue, setissue] = React.useState([
    {
      name: '0',
      value: [
        //只有第一行的value有用,别的随意
        {
          name: 'X',
          value: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
        },
        { name: 'mon', value: [10, 10, 50, 40, 50, 60, 70] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
      ],
    },
    {
      name: '1',
      value: [
        //这里的都需要用，具体格式是每一列的数字代表一周
        { name: 'X', value: ['week1', 'week2', 'week3', 'week4'] },
        { name: '1', value: [10, 20, 30, 40] },
        { name: '2', value: [60, 20, 30, 40] },
        { name: '3', value: [50, 20, 30, 40] },
        { name: '4', value: [30, 20, 20, 40] },
        { name: '5', value: [30, 20, 30, 40] },
        { name: '6', value: [30, 20, 20, 40] },
        { name: '7', value: [30, 20, 30, 40] },
      ],
    },
    {
      name: '2',
      value: [
        //这里的都需要用，具体格式是每一列的数字代表一月
        {
          name: 'X',
          value: ['month1', 'month2', 'month3', 'month4', 'month5', 'month6'],
        },
        { name: '1', value: [10, 20, 30, 40, 50, 60] },
        { name: '2', value: [10, 20, 30, 40, 50, 60] },
        { name: '3', value: [10, 20, 30, 40, 50, 60] },
        { name: '4', value: [10, 20, 30, 40, 50, 60] },
        { value: [] },
        { value: [] },
        { value: [] },
      ],
    },
  ]);


  const [issuedifference, setissuedifference] = React.useState([
    {
      name: '0',
      value: [
        //只有第一行的value有用,别的随意
        {
          name: 'X',
          value: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        },
        { name: 'mon', value: [10, 10, 50, 40, 50, 60, 70] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
      ],
    },
    {
      name: '1',
      value: [
        //这里的都需要用，具体格式是每一列的数字代表一周
        { name: 'X', value: ['week1', 'week2', 'week3', 'week4'] },
        { name: '1', value: [0, 10, 10, 10] },
        { name: '2', value: [10, 10, 10, 10] },
        { name: '3', value: [10, 10, 10, 10] },
        { name: '4', value: [10, 10, 10, 10] },
        { name: '5', value: [10, 10, 10, 10] },
        { name: '6', value: [10, 10, 10, 10] },
        { name: '7', value: [10, 10, 10, 10] },
      ],
    },
    {
      name: '2',
      value: [
        //这里的都需要用，具体格式是每一列的数字代表一月
        {
          name: 'X',
          value: ['month1', 'month2', 'month3', 'month4', 'month5', 'month6'],
        },
        { name: '1', value: [0, 0, 0, 10, 10, 10] },
        { name: '2', value: [0, 0, 0, 10, 10, 10] },
        { name: '3', value: [0, 0, 0, 10, 10, 10] },
        { name: '4', value: [0, 0, 0, 10, 10, 10] },
        { value: [] },
        { value: [] },
        { value: [] },
      ],
    },
  ]);

  const [pr, setpr] = React.useState([
    {
      name: '0',
      value: [
        //只有第一行的value有用,别的随意
        {
          name: 'X',
          value: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
        },
        { name: 'mon', value: [60, 30, 30, 40, 50, 60, 70] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
      ],
    },
    {
      name: '1',
      value: [
        //这里的都需要用，具体格式是每一列的数字代表一周
        { name: 'X', value: ['week1', 'week2', 'week3', 'week4'] },
        { name: '1', value: [10, 20, 30, 40] },
        { name: '2', value: [60, 20, 30, 40] },
        { name: '3', value: [50, 20, 30, 40] },
        { name: '4', value: [30, 20, 20, 40] },
        { name: '5', value: [30, 20, 30, 40] },
        { name: '6', value: [30, 20, 20, 40] },
        { name: '7', value: [30, 20, 30, 40] },
      ],
    },
    {
      name: '2',
      value: [
        //这里的都需要用，具体格式是每一列的数字代表一月
        {
          name: 'X',
          value: ['month1', 'month2', 'month3', 'month4', 'month5', 'month6'],
        },
        { name: '1', value: [10, 20, 30, 40, 50, 60] },
        { name: '2', value: [10, 20, 30, 40, 50, 60] },
        { name: '3', value: [10, 20, 30, 40, 50, 60] },
        { name: '4', value: [10, 20, 30, 40, 50, 60] },
        { value: [] },
        { value: [] },
        { value: [] },
      ],
    },
  ]);

  const [prdifference, setprdifference] = React.useState([
    {
      name: '0',
      value: [
        //只有第一行的value有用,别的随意
        {
          name: 'X',
          value: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        },
        { name: 'mon', value: [10, 10, 10, 10, 10, 10, 10] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
        { value: [] },
      ],
    },
    {
      name: '1',
      value: [
        //这里的都需要用，具体格式是每一列的数字代表一周
        { name: 'X', value: ['week1', 'week2', 'week3', 'week4'] },
        { name: '1', value: [10, 10, 10, 10] },
        { name: '2', value: [10, 10, 10, 10] },
        { name: '3', value: [10, 10, 10, 10] },
        { name: '4', value: [10, 10, 10, 10] },
        { name: '5', value: [10, 10, 10, 10] },
        { name: '6', value: [10, 10, 10, 10] },
        { name: '7', value: [10, 10, 10, 10] },
      ],
    },
    {
      name: '2',
      value: [
        //这里的都需要用，具体格式是每一列的数字代表一月
        {
          name: 'X',
          value: ['month1', 'month2', 'month3', 'month4', 'month5', 'month6'],
        },
        { name: '1', value: [10, 10, 10, 10, 10, 10] },
        { name: '2', value: [10, 10, 10, 10, 10, 10] },
        { name: '3', value: [10, 10, 10, 10, 10, 10] },
        { name: '4', value: [10, 10, 10, 10, 10, 10] },
        { value: [] },
        { value: [] },
        { value: [] },
      ],
    },
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
    () => async () => {
      try {
        const data = await request.get('/project/commit', {
          projectName,
        });
        if (data instanceof Array) {
          setcommit(data);
        } else {
          throw new Error('Invalid data');
        }
      } catch (e) {
        // TODO: handle error
        console.error(e);
      }
    },
    () => async () => {
      try {
        const data = await request.get('/project/issue', {
          projectName,
        });
        if (data instanceof Array) {
          setissue(data);
        } else {
          throw new Error('Invalid data');
        }
      } catch (e) {
        // TODO: handle error
        console.error(e);
      }
    },
    () => async () => {
      try {
        const data = await request.get('/project/pr', {
          projectName,
        });
        if (data instanceof Array) {
          setpr(data);
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

  const barChartStyle = {
    height: '70vh',
  };

  let handlechange = (event) => {
    setchoosemode((choosemode) => event.target.value);
  };

  const projectTableData = [
    { id: 1, type: 'Bug', time: '10:00', author: 'John', status: 'Open' },
    { id: 2, type: 'Bug', time: '10:00', author: 'John', status: 'Open' },
    { id: 3, type: 'Bug', time: '10:00', author: 'John', status: 'Open' },
    { id: 4, type: 'Bug', time: '10:00', author: 'John', status: 'Open' },
  ];

  return (
    <Layout>
      <Grid item container direction='column' xs={12} sm={4}>
        <NumberCard data={{ commit: '10', issue: '23', pullRequest: '244' }} />
        <PieChart
          title={'Project Composition'}
          data={composeData}
          style={pieChartStyle}
        />

        <RadioGroup
          row
          aria-label='time'
          name='row-radio-buttons-group'
          value={choosemode}
          onChange={handlechange}
        >
          <FormControlLabel value='0' control={<Radio />} label='week' />
          <FormControlLabel value='1' control={<Radio />} label='month' />
          <FormControlLabel value='2' control={<Radio />} label='halfyear' />
        </RadioGroup>

        <ChartSwitcher
          chart0={
            <BarChart
              title={'Commits'}
              mode={choosemode}
              xname={'Time'}
              yname={'Commit'}
              xvalue={commit[choosemode].value}
              xdifference={commitdifference[choosemode].value}
              style={barChartStyle}
            />
          }
          chart1={
            <TagRankChart
              data={[
                { name: 'log4j2', value: 10 },
                { name: 'server', value: 15 },
                { name: 'spring', value: 20 },
              ]}
              style={barChartStyle}
            />
          }
        />
      </Grid>
      <Grid item container direction='column' xs={12} sm={4}>
        <BarChart
          title={'Issue'}
          mode={choosemode}
          xname={'Time'}
          yname={'Issue'}
          xvalue={issue[choosemode].value}
          xdifference={issuedifference[choosemode].value}
          style={barChartStyle}
        />

        <BarChart
          title={'Pr'}
          mode={choosemode}
          xname={'Time'}
          yname={'Pr'}
          xvalue={pr[choosemode].value}
          xdifference={prdifference[choosemode].value}
          style={barChartStyle}
        />
      </Grid>
      <Grid item container direction='column' xs={12} sm={4}>
        <Card style={{ margin: '1rem 1rem 1rem 0' }}>
          <ProjectTable data={projectTableData} />
        </Card>
      </Grid>
    </Layout>
  );
};

export default Dashboard;
