import React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

const MemberCard = ({ name, avatar, description }) => {
  const cardStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: '1rem 2rem 0 2rem',
    marginTop: '1rem',
    minHeight: '6rem',
  };

  const avatarStyle = {
    maxWidth: '15%',
    minWidth: '20px',
    marginRight: '1rem',
  };

  return (
    <Card style={cardStyle}>
      <Avatar alt={avatar} src={avatar} style={avatarStyle} />
      <div>
        <Typography variant='h5'>{name}</Typography>
        <Typography variant='body1'>{description}</Typography>
      </div>
    </Card>
  );
};

export default MemberCard;
