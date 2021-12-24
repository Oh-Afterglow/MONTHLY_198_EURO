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
    'Closed_pull_request_number_by_year',
    'Closed_pull_request_number_by_year',
    'Tagged_issue_number_by_week',
    'Tagged_issue_number_by_year',
    'Personal_contribution_number_by_week',
    'Personal_contribution_number_by_year',
  ];

  const listItems = listName.map((item, id) => (
    <ListItemButton key={item} onClick={() => setDataType(id)}>
      {item}
    </ListItemButton>
  ));

  const handleSubmit = () => {
    console.log(chartType, dataType, paramName);
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}></Grid>
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
    </>
  );
};

export default CustomCard;