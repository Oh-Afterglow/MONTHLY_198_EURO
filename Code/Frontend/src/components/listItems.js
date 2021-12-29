import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { SignalCellularNullOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CtxWrapper from '../utils/CtxWrapper';
import useProject from '../utils/useProject';

export const MainListItems = () => <MainListItemsSub />;
export const SecondaryListItems = () => <SecondaryListItemsSub />;

const MainListItemsSub = () => {
  const { value } = useProject();
  console.log(value);
  const nav = useNavigate();

  return (
    <>
      <ListItem button onClick={() => nav(`/project/${value}`)} >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary='Project Overview' />
      </ListItem>
      <ListItem button onClick={() => nav(`/member/${value}`)}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary='Member Overview' />
      </ListItem>
      <ListItem button onClick={() => nav(`/custom/${value}`)}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary='Custom Charts' />
      </ListItem>
      <ListItem button onClick={() => nav(`/admin`)}>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary='Admin Panel' />
      </ListItem>
    </>
  );
};

const SecondaryListItemsSub = () => {
  const { all, set } = useProject();

  const ListItemButtons = all.map((proj) => (
    <ListItem button key={proj} onClick={() => set(proj)}>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary={proj} />
    </ListItem>
  ));

  return (
    <>
      <ListSubheader inset>Current Projects</ListSubheader>
      {ListItemButtons}
    </>
  );
};
