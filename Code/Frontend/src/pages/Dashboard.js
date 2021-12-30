import React, { useState, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Layout from '../components/Layout';
import NumberCard from '../components/NumberCard';
import BarChart from '../components/BarChart';
import request from '../utils/request';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Card, IconButton } from '@mui/material';
import ChartSwitcher from '../components/ChartSwitcher';
import SolvedurationChart from '../components/SolvedurationChart';
import TagRankChart from '../components/TagRankChart';
import { useParams } from 'react-router-dom';
import { PieChart, ResponsiveContainer, Pie, Tooltip, Sector } from 'recharts';
import CommitTable from '../components/CommitTable';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const Dashboard = () => {
  // TODO: Replace with some default data

  const projectName = useParams().name;
  sessionStorage.setItem(
    'selectpro',
    projectName.split('/')[0] + '%2F' + projectName.split('/')[1]
  );

  const [composeData, setComposeData] = React.useState([
    { name: 'Text', value: 100 },
    { name: 'Image', value: 200 },
  ]);

  const commitname = [
    'Daily Commit in the Past Week',
    'Daily Commit in the Past Month',
    'Monthly Commit in the Half Year',
  ];
  const issuename = [
    'Daily Issue in the Past Week',
    'Daily Issue in the Past Month',
    'Monthly Issue in the Half Year',
  ];
  const prname = [
    'Daily Pull Request in the Past Week',
    'Daily Pull Request in the Past Month',
    'Monthly Pull Request in the Half Year',
  ];

  const [projectnumber, setProjectnumber] = React.useState([
    { commit: '10', issue: '23', pullRequest: '244' },
  ]);

  const [tagdata, setTagdata] = React.useState([
    { name: 'log4j2', value: 10 },
    { name: 'server', value: 15 },
    { name: 'spring', value: 25 },
  ]);

  const [choosemode, setchoosemode] = useState(0);
  //为了降低代码量，这里使用的格式比较蠢，想的是后端把这里都返回过来，然后改图表粒度的时候就可以简单点
  const [commit, setcommit] = React.useState([
    {
      name: '0',
      value: [
        //只有第一行的value有用,别的随意

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

  const [IssueSolveData, setIssueSolveData] = React.useState([
    10, 20, 30, 40, 20,
  ]);

  const [PrSolveData, setPrSolveData] = React.useState([10, 20, 30, 40, 20]);

  React.useEffect(() => {
    const f1 = async () => {
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
    };
    const f2 = async () => {
      console.log('2');
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
    };
    const f3 = async () => {
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
    };
    const f4 = async () => {
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
    };
    const f5 = async () => {
      try {
        const data = await request.get('/project/issuewait', {
          projectName,
        });
        if (data instanceof Array) {
          setissuedifference(data);
          console.log(data);
        } else {
          throw new Error('Invalid data');
        }
      } catch (e) {
        // TODO: handle error
        console.error(e);
      }
    };
    const f6 = async () => {
      try {
        const data = await request.get('/project/prwait', {
          projectName,
        });
        if (data instanceof Array) {
          setprdifference(data);
        } else {
          throw new Error('Invalid data');
        }
      } catch (e) {
        // TODO: handle error
        console.error(e);
      }
    };
    const f7 = async () => {
      try {
        const data = await request.get('/project/issuesolve', {
          projectName,
        });
        if (data instanceof Array) {
          setIssueSolveData(data);
        } else {
          throw new Error('Invalid data');
        }
      } catch (e) {
        // TODO: handle error
        console.error(e);
      }
    };
    const f8 = async () => {
      try {
        const data = await request.get('/project/prsolve', {
          projectName,
        });
        if (data instanceof Array) {
          setPrSolveData(data);
        } else {
          throw new Error('Invalid data');
        }
      } catch (e) {
        // TODO: handle error
        console.error(e);
      }
    };

    const f9 = async () => {
      try {
        const data = await request.get('/project/numbers', {
          projectName,
        });

        setProjectnumber(data);
      } catch (e) {
        // TODO: handle error
        console.error(e);
      }
    };

    const f10 = async () => {
      try {
        const data = await request.get('/project/issue/tag', {
          projectName,
        });
        if (data instanceof Array) {
          setTagdata(data);
        } else {
          throw new Error('Invalid data');
        }
      } catch (e) {
        // TODO: handle error
        console.error(e);
      }
    };
    f1();
    f2();
    f3();
    f4();
    f5();
    f6();
    f7();
    f8();
    f9();
    f10();
  }, []);

  const pieChartStyle = {
    height: '50vh',
  };

  const barChartStyle = {
    height: '50vh',
  };

  let handlechange = (event) => {
    setchoosemode((choosemode) => event.target.value);
  };

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor='middle' fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill='none'
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill='#333'
        >{`PV ${value}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill='#999'
        >
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '1rem 0 1rem',
  };

  const cardStyle1 = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '1rem 0 1rem 1rem',
  };

  const ref = useRef(null);

  const commitdata = [
    { name: 'Bug', commit: '10:00' },
    { name: 'Bug', commit: '10:00' },
    { name: 'Bug', commit: '10:00' },
    { name: 'Bug', commit: '10:00' },
  ];

  const [index, setIndex] = React.useState(1);

  const actions = [
    { icon: <FileCopyIcon />, name: 'Copy' },
    { icon: <SaveIcon />, name: 'Save' },
    { icon: <PrintIcon />, name: 'Print' },
    { icon: <ShareIcon />, name: 'Share' },
  ];

  const [cardShow, setCardShow] = useState(false);

  const modeCardStyle = (flag) => ({
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    padding: flag ? '1rem' : '1rem 0',
  });

  return (
    <Layout>
      <Grid item container direction='column' xs={12} sm={4}>
        <NumberCard data={projectnumber} />
        <Card style={{ height: '41.3vh', margin: '1rem 0 1rem' }}>
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant='h6'
            id='tableTitle'
            component='div'
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '1rem',
            }}
          >
            Language Compose
          </Typography>
          <PieChart width={400} height={250}>
            <Pie
              activeIndex={index}
              activeShape={renderActiveShape}
              data={composeData}
              cx='50%'
              cy='50%'
              innerRadius={40}
              outerRadius={60}
              fill='#8884d8'
              dataKey='value'
              onMouseEnter={(_, index) => setIndex(index)}
            />
            <Tooltip />
          </PieChart>
        </Card>

        <ChartSwitcher
          chart0={
            <BarChart
              mode={choosemode}
              xname={'T'}
              yname={'Mount'}
              xvalue={commit[choosemode].value}
              xdifference={commitdifference[choosemode].value}
              style={barChartStyle}
              color={'#FFD700'}
            />
          }
          chart1={
            <BarChart
              mode={choosemode}
              xname={'T'}
              yname={'Mount'}
              xvalue={commit[choosemode].value}
              xdifference={commitdifference[choosemode].value}
              style={barChartStyle}
              color={'#FFD700'}
            />
          }
          style={cardStyle}
          showSwitch={false}
          name={commitname[choosemode]}
          name1={commitname[choosemode]}
        />
      </Grid>
      <Grid item container direction='column' xs={12} sm={4}>
        <Card style={{ height: '54vh', margin: '1rem 0rem 1rem' }}>
          <TagRankChart data={tagdata} style={barChartStyle} />
        </Card>

        <ChartSwitcher
          chart0={
            <BarChart
              mode={choosemode}
              xname={'T'}
              yname={'Mount'}
              xvalue={issue[choosemode].value}
              xdifference={issuedifference[choosemode].value}
              style={{ height: '50vh' }}
              color={'#3CB371'}
            />
          }
          chart1={
            <SolvedurationChart
              title={' '}
              xname={'T'}
              yname={'Mount'}
              value={IssueSolveData}
              style={barChartStyle}
            />
          }
          style={cardStyle}
          name={issuename[choosemode]}
          name1='Issue Solved Duration'
          showSwitch
        />
      </Grid>
      <Grid item container direction='column' xs={12} sm={4}>
        <CommitTable />
        <ChartSwitcher
          chart0={
            <BarChart
              mode={choosemode}
              xname={'T'}
              yname={'Mount'}
              xvalue={pr[choosemode].value}
              xdifference={prdifference[choosemode].value}
              style={barChartStyle}
              color={'#FFA07A'}
            />
          }
          chart1={
            <SolvedurationChart
              title={' '}
              xname={'T'}
              yname={'Mount'}
              value={PrSolveData}
              style={barChartStyle}
            />
          }
          style={cardStyle}
          name={prname[choosemode]}
          name1='Pull Request Solved Duration'
          showSwitch
        />
      </Grid>
      <Card style={modeCardStyle(cardShow)}>
        {!cardShow ? (
          <Typography
            onClick={() => setCardShow(true)}
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
              cursor: 'pointer',
              opacity: 0.3,
            }}
          >
            MODE
          </Typography>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant='h6' component='div'>
                Mode
              </Typography>
              <Button
                style={{
                  maxWidth: '20px',
                  minWidth: '20px',
                }}
                onClick={() => setCardShow(false)}
                startIcon={<CloseIcon />}
              />
            </div>
            <RadioGroup
              aria-label='time'
              name='row-radio-buttons-group'
              value={choosemode}
              onChange={handlechange}
            >
              <FormControlLabel value='0' control={<Radio />} label='week' />
              <FormControlLabel value='1' control={<Radio />} label='month' />
              <FormControlLabel
                value='2'
                control={<Radio />}
                label='halfyear'
              />
            </RadioGroup>
          </>
        )}
      </Card>
    </Layout>
  );
};

export default Dashboard;
