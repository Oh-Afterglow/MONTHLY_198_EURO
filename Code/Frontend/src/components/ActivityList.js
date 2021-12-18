import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Card from '@mui/material/Card';

export default function ActivityList({ data }) {
  const displayStyle = {
    display: !!data ? 'block' : 'none',
  };

  const activities = data.map(({ time, activity }, id) => (
    <ListItem key={id}>
      {time} {activity}
    </ListItem>
  ));

  return (
    <Card style={displayStyle}>
      <List>{activities}</List>
    </Card>
  );
}
