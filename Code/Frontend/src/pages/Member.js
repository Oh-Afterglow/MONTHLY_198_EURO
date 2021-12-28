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
import {useParams} from 'react-router-dom'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const Member = () => {
  // TODO: Replace with some default data
  const projectName = useParams().name;
  const [composeData, setComposeData] = React.useState([
    { name: 'Unknown', value: 100 },
  ]);

  const [members, setMembers] = useState([
   
  ]);

  const [projects, setProjects] = useState([
    
  ]);

  const  [memberTableData, setmemberTableData] =  useState([
    
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
   
      f1()
      f2()
      f3()
      },
    []
  );

  const pieChartStyle = {
    height: '50vh',
    marginRight: 0,
  };


  async function searchmember(id,flag){                                         //获取某个用户的所有管理pro
    //这里向后端发请求获取
    if(flag!=1){
      console.log("jaja")
        let userid = members[id].name
        console.log(userid)
        try {
            const data = await request.get('/member/projects', {
                userid,
            });
            if (data instanceof Array) {
              setProjects(data);
            } else {
              throw new Error('Invalid data');
            }
          } catch (e) {
            // TODO: handle error
            console.error(e);
          }
    }
    else{
      setProjects([]);
    }
  }
  
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

  let UsercardStyleoutline = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: '1rem 2rem 0 2rem',
    marginTop: '1rem',
    minHeight: '6rem',
    border:'2px solid blue'
  };

  const ProjectcardStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: '1rem 2rem 0 2rem',
    margin: '1rem 1rem 0 0',
    minHeight: '8rem',
  };

  const ProjectcardStyleoutline = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: '1rem 2rem 0 2rem',
    margin: '1rem 1rem 0 0',
    minHeight: '8rem',
    border:'2px solid blue'
  };


  const memberCards = members.map((member, id) => (
    <>
      <MemberCard
        key={member.name}
        data={{ ...member, activities }}
        showActivities={true}
        cardStyle={selectedMember!== id ?UsercardStyle:UsercardStyleoutline}
        onClick={() =>   {setSelectedMember(selectedMember === id ? -1 : id),searchmember(id,selectedMember === id)}}
      />
      {selectedMember === id && <ActivityList data={activities} />}
    </>
  ));

  const projectCards = projects.map((project) => (
    <a href={'https://github.com/'+project.name}   target="_blank" style={{ textDecoration: 'none' }}>
      <ProjectCard key={project.name} data={project} cardStyle={ProjectcardStyle}/>
    </a>
  ));

  return (
    <Layout>
      <Grid item container direction='column' xs={12} sm={4}>
        <PieChart
          title={'Member From'}
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
        {projects.length==0?<Alert severity="success" ><AlertTitle><h1>Info</h1></AlertTitle><h2>Hello, please choose a project — <strong>from left list</strong></h2></Alert>:projectCards}
      </Grid>
    </Layout>
  );
};

export default Member;
