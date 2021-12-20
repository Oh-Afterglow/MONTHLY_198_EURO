import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Layout from '../components/Layout';
import PieChart from '../components/PieChart';
import request from '../utils/request';
import MemberTable from '../components/MemberTable';
import MemberCard from '../components/MemberCard';
import ProjectCard from '../components/ProjectCard';
import { Card } from '@mui/material';
import ActivityList from '../components/ActivityList';

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

  const  [memberTableData, setmemberTableData] =  useState([
    { id: 1, time: '2021/11/11', event: 'Development01 join the team' },
    { id: 2, time: '2021/11/11', event: 'Development01 leave the team' },
    { id: 3, time: '2021/11/30', event: 'Development03 join the team' },
    { id: 4, time: '2021/11/11', event: 'Development04 join the team' },
  ]);

  React.useEffect(() => {
    const f1 = async () => {
      try {
        const data = await request.get('/member/compose', {
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
    }
    const f2 = async () => {
      try {
        const data = await request.get('/member/events', {
          projectName,
        });
        if (data instanceof Array) {
          setmemberTableData(data);
        } else {
          throw new Error('Invalid data');
        }
      } catch (e) {
        // TODO: handle error
        console.error(e);
      }
    }
    const f3 = async () => {
      try {
        const data = await request.get('/member/members', {
          projectName,
        });
        if (data instanceof Array) {
          setMembers(data);
        } else {
          throw new Error('Invalid data');
        }
      } catch (e) {
        // TODO: handle error
        console.error(e);
      }
    }
      const f4 = async () => {
        try {
          const data = await request.get('/member/projects', {
            projectName,
          });
          if (data instanceof Array) {
            setProjects(data);
            console.log(data)
          } else {
            throw new Error('Invalid data');
          }
        } catch (e) {
          // TODO: handle error
          console.error(e);
        }
      }
      f1()
      f2()
      f3()
      f4()


      },
    []
  );

  const pieChartStyle = {
    height: '50vh',
    marginRight: 0,
  };



  const [selectedMember, setSelectedMember] = useState(-1);
  const activities = [
    { time: '2020/11/11', activity: 'make a commit' },
    { time: '2020/12/31', activity: 'close an issue' },
  ];

  useEffect(() => {
    // TODO: fetch member projects
    // TODO: filter member activities
  }, [selectedMember]);

  let UsercardStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: '1rem 2rem 0 2rem',
    marginTop: '1rem',
    minHeight: '6rem',
    border:'0px solid red'
  };

  const ProjectcardStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: '1rem 2rem 0 2rem',
    margin: '1rem 1rem 0 0',
    minHeight: '8rem',
  };

  const memberCards = members.map((member, id) => (
    <>
      <MemberCard
        key={member.name}
        data={{ ...member, activities }}
        showActivities={true}
        cardStyle={UsercardStyle}
        onClick={() => setSelectedMember(selectedMember === id ? -1 : id)}
      />
      {selectedMember === id && <ActivityList data={activities} />}
    </>
  ));

  const projectCards = projects.map((project) => (
    <ProjectCard key={project.name} data={project} cardStyle={ProjectcardStyle}/>
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
