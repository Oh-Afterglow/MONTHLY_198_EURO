import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Layout from '../components/Layout';
import PieChart from '../components/PieChart';
import request from '../utils/request';
import MemberTable from '../components/MemberTable';
import MemberCard from '../components/MemberCard';
import ProjectCard from '../components/ProjectCard';
import { Card } from '@mui/material';

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
      lastupdate: 'Updated on 29 Jun 2020',
    },
    {
      name: 'cCompiler',
      description: '这个人很懒，什么都没有留下',
      major: 'javascript',
      star: '20',
      lastupdate: 'Updated on 29 Jun 2020',
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
    marginRight: 0,
  };

  const memberTableData = [
    { id: 1, time: '2021/11/11', event: 'Development01 join the team' },
    { id: 2, time: '2021/11/11', event: 'Development01 leave the team' },
    { id: 3, time: '2021/11/30', event: 'Development03 join the team' },
    { id: 4, time: '2021/11/11', event: 'Development04 join the team' },
  ];

  const memberCards = members.map((member) => (
    <MemberCard key={member.name} data={member} />
  ));

  const projectCards = projects.map((project) => (
    <ProjectCard key={project.name} data={project} />
  ));

  return (
    <Layout>
      <Grid item container direction='column' xs={12} sm={4}>
        <PieChart
          title={'Member from'}
          data={composeData}
          style={pieChartStyle}
        />
        <Card>
          <MemberTable data={memberTableData} />
        </Card>
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
