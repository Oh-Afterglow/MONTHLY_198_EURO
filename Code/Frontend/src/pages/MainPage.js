import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Layout from '../components/Layout';
import request from '../utils/request';
import MemberCard from '../components/MemberCard';
import ProjectCard from '../components/ProjectCard';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import useProject from '../utils/useProject';

const MainPage = () => <MainPageSub />;

const MainPageSub = () => {
  const { set, setAll } = useProject();

  // TODO: Replace with some default data

  const [projects, setProjects] = useState([
    //所有的pro
    {
      name: 'pytorch/pytorch',
      description: '浙江大学 区块链与数字货币课程',
      major: 'javascript',
      star: '20',
      lastupdate: 'Updated on 29 Jun 2020',
    },
    ,
  ]);

  React.useEffect(() => {
    const f1 = async () => {
      //获取所有用户数据
      try {
        const data = await request.get('/user/allproject', {});
        if (data instanceof Array) {
          setProjects(data);
          setAll(data);
          console.log(data);
        } else {
          throw new Error('Invalid data');
        }
      } catch (e) {
        // TODO: handle error
        console.error(e);
      }
    };

    f1();
  }, []);

  const ProjectcardStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: '1rem 2rem 0 2rem',
    margin: '1rem 1rem 0 0',
    minHeight: '8rem',
  };

  const projectCards = projects.map((project, id) => {
    const nav = useNavigate();
    const handleClick = (name) => {
      console.log(name);
      nav(`/project/${encodeURIComponent(name)}`);
      set(name);
    };
    return (
      <ProjectCard
        key={project.name}
        data={project}
        cardStyle={ProjectcardStyle}
        onClick={() => handleClick(project.name)}
      />
    );
  });

  return (
    <Layout>
      <Grid item container direction='column' xs={12} sm={4}>
        {projectCards}
      </Grid>
      <Grid item container direction='column' xs={12} sm={4}></Grid>
      <Grid item container direction='column' xs={12} sm={4}></Grid>
    </Layout>
  );
};

export default MainPage;
