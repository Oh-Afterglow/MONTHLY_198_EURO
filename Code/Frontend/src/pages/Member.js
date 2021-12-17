import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Layout from '../components/Layout';
import NumberCard from '../components/NumberCard';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import request from '../utils/request';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import MemberTable from '../components/MemberTable';
import FormControlLabel from '@mui/material/FormControlLabel';
import MemberCard from '../components/MemberCard';
import ProjectCard from '../components/ProjectCard';


const Member = ({ projectName }) => {
  // TODO: Replace with some default data
  const [composeData, setComposeData] = React.useState([
    { name: 'Facebook', value: 50 },
    { name: 'Google', value: 20 },
    { name: 'Baidu', value: 10 },
    { name: 'ZJU', value: 10 },
  ]);

  const [members, setMembers] = useState([
    {
      name: '张三',
      avatar: 'https://avatars0.githubusercontent.com/u/8186664?s=460&v=4',
      description: '这个人很懒，什么都没有留下',
    },
    {
      name: '李四',
      avatar: 'https://avatars0.githubusercontent.com/u/8186664?s=460&v=4',
      description: '这个人很懒，什么都没有留下',
    },
  ]);

  const [projects, setProjects] = useState([
    {
      name: 'blockchainCourse',
      description: '浙江大学 区块链与数字货币课程',
      major: 'javascript',
      star: '20',
      lastupdate: 'Updated on 29 Jun 2020'
    },
    {
      name: 'cCompiler',
      description: '这个人很懒，什么都没有留下',
      major: 'javascript',
      star: '20',
      lastupdate: 'Updated on 29 Jun 2020'
    },
  ]);

  React.useEffect(
    () => async () => {
      try {
        const data = await request.get('/project/compose', {
          projectName,
        });
        if (data instanceof Array) {
          setComposeData(data);
        } else {
          throw new Error('Invalid data');
        }
      } catch (e) {
        // TODO: handle error
        console.error(e);
      }
    },
    []
  );

  const pieChartStyle = {
    height: '50vh',
  };

  const memberCards = members.map((member) => (
    <MemberCard key={member.name} {...member} />
  ));

  const projectCards = projects.map((project) => (
    <ProjectCard key={project.name} {...project} />
  ));

  return (
    <Layout>
      <Grid item container direction='column' xs={12} sm={4}>
        <PieChart
          title={'Member from'}
          data={composeData}
          style={pieChartStyle}
        />
        {/* <MemberTable /> */}
      </Grid>
      <Grid item container direction='column' xs={12} sm={4}>
        {memberCards}
      </Grid>
      <Grid item container direction='column' xs={12} sm={4}>
        {projectCards}

      </Grid>
    </Layout>
  );
};

export default Member;
