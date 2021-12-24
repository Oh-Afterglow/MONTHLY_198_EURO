import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ProTip from './ProTip';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/Signin';
import SignUp from './pages/Signup';
import Member from './pages/Member';
import CustomCard from './pages/CustomCard';
import Admin from './pages/Admin';

function Copyright() {
  return (
    <Typography variant='body2' color='text.secondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='https://mui.com/'>
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/project/:name' element={<Dashboard />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/custom/:name' element={<CustomCard />} />
        <Route path='/member/:name' element={<Member />} />
        <Route path='/admin' element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
