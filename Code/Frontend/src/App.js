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
import CustomCard from './components/CustomCard';
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
        <Route path='/' element={<Dashboard projectName={'pytorch/pytorch'}/>} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
<<<<<<< HEAD
        <Route path='/member' element={<Member />} />
        <Route path='/custom' element={<CustomCard />} />
=======
        <Route path='/member' element={<Member  projectName={'pytorch/pytorch'}/>} />
        <Route path='/admin' element={<Admin />} />
>>>>>>> cc503c739c476c954cff446530a29a81aece3a36
      </Routes>
    </BrowserRouter>
  );
}
