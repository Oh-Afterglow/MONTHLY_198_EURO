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
import {ResponsiveContainer } from 'recharts';
import CustomBar from '../components/CustomBar';
import CustomLine from '../components/CustomLine';
import CustomPie from '../components/CustomPie';
import request from '../utils/request';


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

  const [data,setData] = React.useState([
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
  ])

  const getdata = async () => {                                       //获取所有用户数据
      try {
          const data = await request.get('/custom/customize', {
            "chartType": listName[dataType],
            "paramValue": dataType>=17?paramName:null,
            "project":projectName,
          },);
          if (data instanceof Array) {
            setData(data);
          } else {
              throw new Error('Invalid data');
          }
      } catch (e) {
      // TODO: handle error
          console.error(e);
      }
  }

  React.useEffect(() =>
    {
      getdata();
    },
    [dataType]);


  const listItems = listName.map((item, id) => (
    id==dataType?
    <ListItemButton key={item} onClick={() => setDataType(id)}  style={{backgroundColor:"#CCFFCC"}}>
      {item}
    </ListItemButton>
    :<ListItemButton key={item} onClick={() => setDataType(id)}>
      {item}
    </ListItemButton>
  ));

  const handleSubmit = () => {
    console.log(chartType, dataType, paramName);
    getdata();
  };

  return (
    <Layout>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>

          {(chartType===0)&&<ResponsiveContainer width="40%" height="20%">
            <CustomPie data={data}/>
          </ResponsiveContainer>}

          {(chartType===1)&&<ResponsiveContainer width="40%" height="20%">
            <CustomBar data={data}/>
          </ResponsiveContainer>}

          {(chartType===2)&&<ResponsiveContainer width="40%" height="20%">
            <CustomLine data={data}/>
          </ResponsiveContainer>}

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
