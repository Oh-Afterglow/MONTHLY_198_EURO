import {
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  requestBody,
  response, HttpErrors,
} from '@loopback/rest';
import {UserRepository} from "@loopback/authentication-jwt";
import {ProjRepoRepository, UserExtensionRepository} from '../repositories';
import {authenticate} from "@loopback/authentication";
import {ALL_MEMBERS as ALL_USERS, MEMBER_PROJ as PROJECTS, project} from "./member.controller";//reusing response objects
import {SecurityBindings, securityId, UserProfile} from "@loopback/security";
import {inject} from "@loopback/core";
import {Octokit} from "@octokit/core";

export class AdminController {
  constructor(
    @repository(UserExtensionRepository)
    public userExtensionRepository : UserExtensionRepository,
    @repository(UserRepository)
    protected userRepository: UserRepository,
    @repository(ProjRepoRepository)
    protected repoRepository: ProjRepoRepository,

    protected octokit: Octokit = new Octokit(),
  ) {}

  @authenticate('jwt')
  @get('/admin/alluser')
  @response(200, ALL_USERS)
  async allUser(
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<{name: string, avatar: string, description: string}[]>{
    let currentUserID = currentUserProfile[securityId];
    let currentUserEmail = await this.userRepository.findById(currentUserID, {fields: ["email"]});
    let currentUser = await this.userExtensionRepository.findOne({where: {email: currentUserEmail.email}, fields: ['is_admin']});
    if(!currentUser?.is_admin){
      throw new HttpErrors.Forbidden();
    }
    let result: {name: string, avatar: string, description: string}[] = [];
    let userExtraInfos = await this.userExtensionRepository.find({where: {is_admin: false}, fields: ["avatar", "email", "github_username"]});
    for (const userExtraInfo of userExtraInfos) {
      let userBasicInfo = await this.userRepository.findOne({where: {email: userExtraInfo.email}, fields: ["username", "id"]});
      let avatarUrl: string = <string>userBasicInfo?.username;
      if(typeof userExtraInfo.avatar === undefined){
        let userGithubInfo = await this.octokit.request("GET /users/{username}", {
          username: userExtraInfo.github_username,
        });
        if(userGithubInfo.status === 200)//if the GitHub login name exists
        avatarUrl = <string>userGithubInfo.data.avatar_url;
      }
      else {
        // TODO: Let avatar url be a controller route
      }
      result.push({
        name: <string>userBasicInfo?.username,
        avatar: avatarUrl,
        description: userExtraInfo.email,
      });
      // console.log(result);
    }
    return result;
  }

  @authenticate('jwt')
  @get('/admin/allproject')
  @response(200, PROJECTS)
  async allProject(
    @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<project[]>{
    let currentUserID = currentUserProfile[securityId];
    let currentUserEmail = await this.userRepository.findById(currentUserID, {fields: ["email"]});
    let currentUser = await this.userExtensionRepository.findOne({where: {email: currentUserEmail.email}, fields: ['is_admin']});
    if(!currentUser?.is_admin){
      throw new HttpErrors.Forbidden();
    }
    let result: {
      name: string,
      description: string,
      major: string,
      stars: number,
      lastUpdate: string
    }[] = [];
    let projects = await this.repoRepository.find({where: {isCoreProject: true}, fields: ["full_name", "description", "language", "star_num", "updated_at"]});
    for (const project of projects) {
      if(project.description === undefined){
        project.description = 'SRE is the best course of SE!';
      }
      if(project.language === undefined) project.language = 'typescript';//At most time it shouldn't be undefined
      result.push({
        name: project.full_name,
        description: project.description,
        major: project.language,
        stars: project.star_num,
        lastUpdate: project.updated_at,
      });
    }
    return result;
  }

  @authenticate('jwt')
  @get('/admin/getuserpro')
  @response(200, PROJECTS)
  async userProjView(
     @param.query.string('userid') userEmail: string,
     @inject(SecurityBindings.USER)
        currentUserProfile: UserProfile,
  ): Promise<project[]>{
    let currentUserID = currentUserProfile[securityId];
    let currentUserEmail = await this.userRepository.findById(currentUserID, {fields: ["email"]});
    let currentUser = await this.userExtensionRepository.findOne({where: {email: currentUserEmail.email}, fields: ['is_admin']});
    if(!currentUser?.is_admin){
      throw new HttpErrors.Forbidden();
    }
    let result: project[] = [];
    let user = await this.userExtensionRepository.findById(userEmail, {fields: ["repo_view_list"]});
    if(user === null) throw new HttpErrors.NotFound('User not found');
    if(user.repo_view_list != null){
      for (const projName of user.repo_view_list) {
        let project = await this.repoRepository.findOne({where: {full_name: projName}, fields: ["full_name", "description", "language", "star_num", "updated_at"]});
        if(project === null) {
          throw new HttpErrors.NotFound('Run update for the user, or check if the project name is correct');
        }
        if(project.description === undefined) project.description = 'Arch真香';
        if(project.language === undefined) project.language = 'typescript';
        result.push({
          name: project.full_name,
          description: project.description,
          major: project.language,
          stars: project.star_num,
          lastUpdate: project.updated_at,
        });
      }
    }

    return result;
  }

  @authenticate('jwt')
  @post('/admin/add')
  @response(200, PROJECTS)
  async addProjForUser(
      @requestBody({
        content: {
          'application/json': {
            schema: {
              type: "object",
              properties: {
                projectName: {type: "string"},
                userid: {type: "string"},
              }
            }
          }
        }
      })
      body: {projectName: string, userid: string},
      @inject(SecurityBindings.USER)
        currentUserProfile: UserProfile,
  ): Promise<project[]>{
    console.log('/admin/add');
    let currentUserID = currentUserProfile[securityId];
    let currentUserEmail = await this.userRepository.findById(currentUserID, {fields: ["email"]});
    let currentUser = await this.userExtensionRepository.findOne({where: {email: currentUserEmail.email}, fields: ['is_admin']});
    if(!currentUser?.is_admin){
      throw new HttpErrors.Forbidden('test');
    }
    let user = await this.userExtensionRepository.findById(body.userid);
    if(user == null) throw new HttpErrors.NotFound('User not found');
    if(user.repo_view_list == null){
      user.repo_view_list = [];
    }
    if(user.repo_view_list.includes(body.projectName)){
      throw new HttpErrors.ExpectationFailed('The project is already belongs to this user.');
    }
    let newProject = await this.repoRepository.findOne({where: {full_name: body.projectName}});
    // console.log(newProject);
    if(!newProject){
      // console.log(111111);
      try{//if the repo is not in the db, create its record
        const repoResponse = await this.octokit.request("GET /repos/{owner}/{repo}", {
          owner: body.projectName.split('/')[0],
          repo: body.projectName.split('/')[1],
        });
        const lang = await this.octokit.request("GET /repos/{owner}/{repo}/languages", {
          owner: body.projectName.split('/')[0],
          repo: body.projectName.split('/')[1],
        });

        await this.repoRepository.create({
          proj_name: repoResponse.data.name,
          id: repoResponse.data.id,
          url: repoResponse.data.html_url,
          full_name: repoResponse.data.full_name,
          description: repoResponse.data.description == null ? undefined : repoResponse.data.description,
          star_num: repoResponse.data.stargazers_count,
          language: repoResponse.data.language == null ? undefined : repoResponse.data.language,
          language_stat: lang.data,
          open_issues_count: repoResponse.data.open_issues_count,
          forks_count: repoResponse.data.forks_count,
          watchers_count: repoResponse.data.watchers_count,
          created_at: repoResponse.data.created_at,
          updated_at: repoResponse.data.updated_at,
          pushed_at: repoResponse.data.pushed_at,
          topics: repoResponse.data.topics,
          default_branch: repoResponse.data.default_branch,
          isCoreProject: true,
          owner_id: repoResponse.data.owner.id
        });
      }catch (Error){
        if(Error.status == 404)
        throw new HttpErrors.NotFound('This repository doesn\'t exists at GitHub.');
        else throw Error;
      }
    }
    user.repo_view_list.push(body.projectName);
    await this.userExtensionRepository.save(user);

    return await this.userProjView(body.userid, currentUserProfile);
  }

  @authenticate('jwt')
  @post('/admin/remove')
  @response(200, PROJECTS)
  async removeProjForUser(
      @requestBody({
        content: {
          'application/json': {
            schema: {
              type: "object",
              properties: {
                projectName: {type: "string"},
                userid: {type: "string"},
              }
            }
          }
        }
      })
      body: {projectName: string, userid: string},
      @inject(SecurityBindings.USER)
        currentUserProfile: UserProfile,
  ): Promise<project[]>{
    let currentUserID = currentUserProfile[securityId];
    let currentUserEmail = await this.userRepository.findById(currentUserID, {fields: ["email"]});
    let currentUser = await this.userExtensionRepository.findOne({where: {email: currentUserEmail.email}, fields: ['is_admin']});
    if(!currentUser?.is_admin){
      throw new HttpErrors.Forbidden();
    }
    let user = await this.userExtensionRepository.findById(body.userid);
    if(user == null) throw new HttpErrors.NotFound('User not found');
    if(!user.repo_view_list.includes(body.projectName)){
      throw new HttpErrors.ExpectationFailed('The project doesn\'t belongs to this user.');
    }
    user.repo_view_list.splice(user.repo_view_list.indexOf(body.projectName), 1);
    // console.log(user.repo_view_list);
    // console.log(user.repo_view_list.indexOf(body.projectName));
    await this.userExtensionRepository.save(user);
    return await this.userProjView(body.userid, currentUserProfile);
  }


  //The controller below is used to test the usages of GitHub REST api.
  @get('/test')
  @response(200)
  async test(){
    try{
      const repoResponse = await this.octokit.request("GET /repos/{owner}/{repo}", {
        owner: 'RalXYZ',
        repo: 'oh-my-tss',
      });
      console.log(repoResponse.status,'\n', repoResponse.data, repoResponse.headers);
      this.octokit = new Octokit();
      const userResponse = await this.octokit.request("GET /rate_limit");
      console.log(userResponse.data);

    }catch (Error){
      console.log(Error.status);
    }finally {
      // const repoResponse = await this.octokit.request("GET /repos/{owner}/{repo}", {
      //   owner: 'pytorch',
      //   repo: 'pytorch',
      // });
      // const lang = await this.octokit.request("GET /repos/{owner}/{repo}/languages", {
      //   owner: 'pytorch',
      //   repo: 'pytorch',
      // });
      // console.log(repoResponse.data.id, '\n', lang.data);
    }
  }

}
