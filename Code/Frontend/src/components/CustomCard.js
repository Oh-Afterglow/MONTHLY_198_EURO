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
} from '@mui/material';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { PieChart, Pie, Sector,LineChart, Line,BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const CustomCard = () => {
  const [chartType, setChartType] = useState(0); // 0: pie chart, 1: bar chart, 2: line chart
  const [dataType, setDataType] = useState(0);
  const [paramName, setParamName] = useState('');

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

  const data = [
    {
      "name": "Page A",
      "value": 4000,
    },
    {
      "name": "Page B",
      "value": 7000,
    },
    {
      "name": "Page C",
      "value": 4000,
    },
    {
      "name": "Page D",
      "value": 2000,
    },
    {
      "name": "Page E",
      "value": 4000,
    },
    {
      "name": "Page F",
      "value": 3000,
    },
    {
      "name": "Page G",
      "value": 4000,
    }
  ]

  const listItems = listName.map((item, id) => (
    <ListItemButton key={item} onClick={() => setDataType(id)}>
      {item}
    </ListItemButton>
  ));

  const handleSubmit = () => {
    console.log(chartType, dataType, paramName);
  };

  return (
    <Layout>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <ResponsiveContainer width="40%" height="20%">
          <BarChart width={730} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="40%" height="20%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="40%" height="20%">
          <PieChart width={400} height={400}>
            <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#8884d8"  label/>
          </PieChart>
          </ResponsiveContainer>

        </Grid>

        
        <Grid item xs={12} sm={4}>
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
          <List>
            {listItems}
            {listName.length - dataType < 5 ? (
              <ListItem>
                <TextField
                  label='Name'
                  value={paramName}
                  onChange={(e) => setParamName(e.target.value)}
                />
              </ListItem>
            ) : null}
          </List>
          <Button color='primary' variant='contained' onClick={handleSubmit}>
            生成图表
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default CustomCard;
