import React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import StarIcon from '@mui/icons-material/Star';
import GitHubIcon from '@mui/icons-material/GitHub';

const ProjectCard = ({ data ,onClick,cardStyle}) => {

  const { name, description, major, stars, lastUpdate } = data;

  return (
    <Card style={cardStyle}  onClick={onClick}>
      <div  style={{display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
        <div>
            <Typography variant='h5'>{name}<Chip label="Public" variant="outlined" size="small"  style={{marginLeft:"10px",marginBottom:"2px"}}/></Typography>
            <Typography variant='body2'  style={{opacity:"0.9"}}>{description}</Typography>
        </div>
        <div style={{display:"flex",alignItems:"center",marginBottom:"8px"}} >
            <GitHubIcon style={{opacity:"0.5"}}/>
            <Typography variant='body1'style={{marginLeft:"10px"}}>{major}</Typography>
            <StarIcon style={{opacity:"0.3" ,marginLeft:"10px"}}/>
            <Typography variant='body1'style={{marginLeft:"5px"}} >{stars}</Typography>
            <Typography variant="caption" style={{marginLeft:"20px",opacity:"0.8" ,}}>{lastUpdate}</Typography>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
