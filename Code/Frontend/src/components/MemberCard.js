import React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import ActivityList from './ActivityList';

const MemberCard = ({ data, onClick ,cardStyle}) => {
  const { name, avatar, description } = data;

  const avatarStyle = {
    maxWidth: '15%',
    minWidth: '20px',
    marginRight: '1rem',
  };


  return (
    <Card variant="outlined" style={cardStyle} onClick={onClick} >
      <Avatar alt={avatar} src={avatar} style={avatarStyle} />
      <div>
        <Typography variant='h5'>{name}</Typography>
        <Typography variant='body1'>{description}</Typography>
      </div>
    </Card>
  );
};

export default MemberCard;
