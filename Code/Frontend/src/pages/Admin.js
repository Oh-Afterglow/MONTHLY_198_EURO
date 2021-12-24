import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Layout from '../components/Layout';
import request from '../utils/request';
import MemberCard from '../components/MemberCard';
import ProjectCard from '../components/ProjectCard';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Admin = ({  }) => {
    // TODO: Replace with some default data

    const [searchallname, setSearchallname] = React.useState('');
    const [searchusername, setSearchusername] = React.useState('');


    const handleChangeuser = (event) => {
    setSearchusername(event.target.value);
    };

    const handleChangeall = (event) => {
    setSearchallname(event.target.value);
    };


    const [members, setMembers] = useState([
    {
        name: '张三',
        avatar: 'https://avatars0.githubusercontent.com/u/8186664?s=460&v=4',
        description: '12333@qq.com',
    },
    {
        name: '李四',
        avatar: 'https://avatars0.githubusercontent.com/u/8186664?s=460&v=4',
        description: '234@qq.com',
    },
    ]);

    const [selectprojects, setSelectprojects] = useState([      //用户的pro
        
    ]);

    const [projects, setProjects] = useState([                 //所有的pro
    {
        name: 'blockchainCourse2',
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
    },]);



    React.useEffect(() =>
    {
        const f1 = async () => {                                       //获取所有用户数据
        try {
            const data = await request.get('/admin/alluser', {
            
            },);
            if (data instanceof Array) {
                setMembers(data);
                console.log(data)
            } else {
                throw new Error('Invalid data');
            }
        } catch (e) {
        // TODO: handle error
            console.error(e);
        }
    }
    const f2 =  async () => {                                       //获取所有项目信息
        try {
            const data = await request.get('/admin/allproject', {
            
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
    f1();
    f2();
    },
    []);


    const [selectedUser, setSelectedUser] = useState(-1);
    const [selectedUserPro, setSelectedUserPro] = useState(-1);
    const [selectedAllPro, setSelectedAllPro] = useState(-1);


    async function searchuser(id){                                         //获取某个用户的所有管理pro
        //这里向后端发请求获取
        if(id!=-1){
            console.log(members[id].description)
            let userid = members[id].description
            try {
                const data = await request.get('/admin/getuserpro', {
                    userid,
                });
                if (data instanceof Array) {
                    setSelectprojects(data);
                } else {
                  throw new Error('Invalid data');
                }
              } catch (e) {
                // TODO: handle error
                console.error(e);
              }
        }
    }

    async function add(){                                                    //增加一个pro到用户
        //这里向后端发请求增加
        if(selectedAllPro!=-1){
            console.log(projects[selectedAllPro].name)
            let addname = projects[selectedAllPro].name
            let userid = members[selectedUser].description
            console.log(addname)
            console.log(userid)
            try {
                const data = await request.post('/admin/add', {
                    projectName:addname,userid:userid
                });
                if (data instanceof Array) {
                    setSelectprojects(data);
                    console.log(data)
                } else {
                  throw new Error('Invalid data');
                }
              } catch (e) {
                // TODO: handle error
                console.error(e);
              }
        }
        
    }

    async function remove(){                                                        //删除一个用户pro
        //这里向后端发请求删除
        if(selectedUserPro!=-1){
            console.log(selectprojects[selectedUserPro].name)
            let deletename = selectprojects[selectedUserPro].name
            let userid = members[selectedUser].description
            console.log(userid)
            try {
                const data = await request.post('/admin/remove', {
                    projectName:deletename,userid:userid
                });
                if (data instanceof Array) {
                    setSelectprojects(data);
                    console.log(data)
                } else {
                  throw new Error('Invalid data');
                }
              } catch (e) {
                // TODO: handle error
                console.error(e);
              }
        }
        
    }

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
        <MemberCard
        key={member.description}
        data={{ ...member}}
        cardStyle={selectedUser !== id ?UsercardStyle:UsercardStyleoutline}
        onClick={() => {setSelectedUser(selectedUser === id ? -1 : id),searchuser(id)}}
        />
    ));

    const userprojectCards = selectprojects.map((project,id) => (
        project.name.indexOf(searchusername)!=-1 &&
        <ProjectCard 
            key={project.name} 
            data={project} 
            cardStyle={selectedUserPro !== id?ProjectcardStyle:ProjectcardStyleoutline}

            onClick={() => {setSelectedUserPro(selectedUserPro === id ? -1 : id)}}
        />
    ));

    const allprojectCards = projects.map((project,id) => (
        project.name.indexOf(searchallname)!=-1 && 
        <ProjectCard 
        key={project.name} 
        data={project} 
        cardStyle={selectedAllPro !== id?ProjectcardStyle:ProjectcardStyleoutline}

        onClick={() => {setSelectedAllPro(selectedAllPro === id ? -1 : id)}}
        />
    ));

    return (
    <Layout>
        <Grid item container direction='column' xs={12} sm={4}>
        {memberCards}
        </Grid>
        <Grid item container direction='column' xs={12} sm={4}>
        <FormControl variant="standard">
            <InputLabel htmlFor="component-simple">Name</InputLabel>
            <Input id="component-simple" value={searchusername} onChange={handleChangeuser} />
        </FormControl>
        <IconButton  onClick={() => {remove()}}>
            <DeleteIcon/>
        </IconButton>
        {userprojectCards}
        </Grid>
        <Grid item container direction='column' xs={12} sm={4}>
        <FormControl variant="standard">
            <InputLabel htmlFor="component-simple">Name</InputLabel>
            <Input id="component-simple" value={searchallname} onChange={handleChangeall} />
        </FormControl>
        <IconButton  onClick={() => {add()}}>
            <AddIcon/>
        </IconButton>
        {allprojectCards}
        </Grid>
    </Layout>
    );
};

export default Admin;
