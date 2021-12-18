import React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import StarIcon from '@mui/icons-material/Star';
import GitHubIcon from '@mui/icons-material/GitHub';

const ProjectCard = ({ name,  description ,major,star,lastupdate}) => {
  const cardStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: '1rem 2rem 0 2rem',
    margin: '1rem 1rem 0 0',
    minHeight: '8rem',
  };



  return (
    <Card style={cardStyle}>
      <div  style={{display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
        <div>
            <Typography variant='h5'>{name}<Chip label="Public" variant="outlined" size="small"  style={{marginLeft:"10px",marginBottom:"2px"}}/></Typography>
            <Typography variant='body2'  style={{opacity:"0.9"}}>{description}</Typography>
        </div>
        <div style={{display:"flex",alignItems:"center",marginBottom:"8px"}} >
            <GitHubIcon style={{opacity:"0.5"}}/>
            <Typography variant='body1'style={{marginLeft:"10px"}}>{major}</Typography>
            <StarIcon style={{opacity:"0.3" ,marginLeft:"10px"}}/>
            <Typography variant='body1'style={{marginLeft:"5px"}} >{star}</Typography>
            <Typography variant="caption" style={{marginLeft:"20px",opacity:"0.8" ,}}>{lastupdate}</Typography>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
