import {
  Grid,
  FormLabel,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  List,
  ListItemButton,
  ListItem,
  TextField,
  Button,
  Card,
} from '@mui/material';
import React, { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { ResponsiveContainer } from 'recharts';
import CustomBar from '../components/CustomBar';
import CustomLine from '../components/CustomLine';
import CustomPie from '../components/CustomPie';
import request from '../utils/request';
import { useParams } from 'react-router-dom';


const CustomCard = () => {
  const [chartType, setChartType] = useState(0); // 0: pie chart, 1: bar chart, 2: line chart
  const [dataType, setDataType] = useState(0);
  const [paramName, setParamName] = useState('');

  const projectName = useParams().name;
  const handleChange = (e) => setChartType(parseInt(e.target.value));

  const listName = [
    'Commit_number_by_organization',
    'Commit_number_by_week',
    'Commit_number_by_year',
    'Issue_number_by_organization',
    'Issue_number_by_week',
    'Issue_number_by_year',
    'Pull_request_number_by_organization',
    'Pull_request_number_by_week',
    'Pull_request_number_by_year',
    'Open_issue_number_by_week',
    'Open_issue_number_by_year',
    'Closed_issue_number_by_week',
    'Closed_issue_number_by_year',
    'Open_pull_request_number_by_week',
    'Open_pull_request_number_by_year',
    'Closed_pull_request_number_by_week',
    'Closed_pull_request_number_by_year',
    'Tagged_issue_number_by_week',
    'Tagged_issue_number_by_year',
    'Personal_contribution_number_by_week',
    'Personal_contribution_number_by_year',
  ];

  const showlistName = [
    'Organization Commit Number',
    'Project Daily Commit Number',
    'Project Monthly Commit Number',
    'Organization Issue Number',
    'Project Daily Issue Number',
    'Project Monthly Issue Number',
    'Organization Pull Request Number',
    'Project Daily Pull Request Number',
    'Project Monthly Pull Request Number',
    'Project Daily Open Issue Number',
    'Project Monthly Open Issue Number',
    'Project Daily Close Issue Number',
    'Project Monthly Close Issue Number',
    'Project Daily Open Pull Request Number',
    'Project Monthly Open Pull Request Number',
    'Project Daily Close Pull Request Number',
    'Project Monthly Close Pull Request Number',
    'Project Daily Issue Number with Tag',
    'Project Monthly Issue Number with Tag',
    'Project Daily Contribution Number with Name',
    'Project Monthly Contribution Number with Name',
  ];

  const [data, setData] = React.useState([
    { name: 'Page A', value: 4000 },
    { name: 'Page B', value: 7000 },
    { name: 'Page C', value: 4000 },
    { name: 'Page D', value: 2000 },
    { name: 'Page E', value: 4000 },
    { name: 'Page F', value: 3000 },
    { name: 'Page G', value: 4000 },
  ]);

  const getdata = async () => {
    //获取所有用户数据
    try {
      const data = await request.post('/custom/customize', {
        chartType: listName[dataType],
        paramValue: dataType >= 17 ? paramName : '1',
        project: projectName,
      });
      if (data instanceof Array) {
        setData(data);
      } else {
        throw new Error('Invalid data');
      }
    } catch (e) {
      // TODO: handle error
      console.error(e);
    }
  };

  React.useEffect(() => {
    getdata();
  }, [dataType]);

  const listItems = showlistName.map((item, id) =>
    id == dataType ? (
      <ListItemButton
        key={item}
        onClick={() => setDataType(id)}
        style={{ backgroundColor: '#CCFFCC' }}
      >
        {item}
      </ListItemButton>
    ) : (
      <ListItemButton key={item} onClick={() => setDataType(id)}>
        {item}
      </ListItemButton>
    )
  );

  const handleSubmit = () => {
    console.log(chartType, dataType, paramName);
    getdata();
  };

  const ref = useRef(null);

  const size = {
    width: Math.trunc((ref.current?.offsetWidth ?? 0) * 0.8),
    height: Math.trunc((ref.current?.offsetHeight ?? 0) * 0.8),
  };

  const charts = [
    <CustomPie data={data} {...size} />,
    <CustomBar data={data} />,
    <CustomLine data={data} />,
  ];

  return (
    <Layout>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <Card style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer ref={ref} width='100%' height='100%'>
              {charts[chartType]}
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card style={{ padding: '1em', marginBottom: '1em' }}>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Chart Type</FormLabel>
              <RadioGroup
                row
                aria-label='gender'
                name='controlled-radio-buttons-group'
                value={chartType}
                onChange={handleChange}
              >
                <FormControlLabel value={0} control={<Radio />} label='Pie' />
                <FormControlLabel value={1} control={<Radio />} label='Bar' />
                <FormControlLabel value={2} control={<Radio />} label='Line' />
              </RadioGroup>
            </FormControl>
          </Card>
          <Card>
            <List>
              {listItems}
              <ListItem>
                <TextField
                  label='Name'
                  disabled={listName.length - dataType >= 5}
                  value={paramName}
                  onChange={(e) => setParamName(e.target.value)}
                />
              </ListItem>
            </List>
          </Card>
          <Button
            color='primary'
            variant='contained'
            onClick={handleSubmit}
            style={{ marginTop: '1em', marginLeft: '5%', width: '90%' }}
          >
            生成图表
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default CustomCard;
