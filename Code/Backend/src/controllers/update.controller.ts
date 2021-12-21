import {inject} from '@loopback/core';
import {ProjRepoRepository, UserExtensionRepository, IssueRepository, PullRepository, CommitRepository, LabelRepository} from '../repositories';
import { get, HttpErrors, response } from '@loopback/rest';
import {authenticate} from "@loopback/authentication";
import {SecurityBindings, securityId, UserProfile} from "@loopback/security";
import {EntityNotFoundError, repository} from "@loopback/repository";
import {Octokit} from "@octokit/core";
import { GithubUserRepository } from '../repositories';
import { UserRepository} from "@loopback/authentication-jwt";
import { Endpoints } from "@octokit/types";
import {Label, PullWithRelations} from "../models";

export class UpdateController {
  constructor(
      @repository(UserExtensionRepository)
      protected userExtensionRepository: UserExtensionRepository,
      @repository(GithubUserRepository)
      protected githubUserRepository: GithubUserRepository,
      @repository(ProjRepoRepository)
      protected repoRepository: ProjRepoRepository,
      @repository(CommitRepository)
      protected commitRepository: CommitRepository,
      @repository(IssueRepository)
      protected issueRepository: IssueRepository,
      @repository(PullRepository)
      protected pullRepository:PullRepository,
      @repository(LabelRepository)
      protected labelRepository: LabelRepository,
      @repository(UserRepository)
      protected userRepository: UserRepository,
      protected octokit = new Octokit({ auth: 'Your-GitHub-Token' }),

  ) {}

  // @authenticate('jwt')
  @get('/update', {
    responses: {
      '200': {
        description: 'The status of updating',
        content: {
          'application/json': {
            schema: {
              type: "boolean",
            }
          }
        }
      }
    }
  })
  async update(
      // @inject(SecurityBindings.USER)
      //     currentUserProfile: UserProfile,
  ): Promise<boolean>{
    // let currentUserID = currentUserProfile[securityId];
    // let currentUser = await this.userRepository.findById(currentUserID, {fields: ["email"]});
    // let permitViewList = await this.userExtensionRepository.findOne({where: {email: currentUser.email}, fields: ['repo_view_list', 'is_admin']});
    // if(!permitViewList) return true;
    try{
      for (const project of ['pytorch/pytorch'] /*<string[]>permitViewList?.repo_view_list*/) {

        let owner = project.split('/')[0];
        let repo = project.split('/')[1];
        const repoResponse = await this.octokit.request("GET /repos/{owner}/{repo}", {
          owner: project.split('/')[0],
          repo: project.split('/')[1],
        });

        /*完成projrepo表的更新 */
        await this.addOrUpdateRepos(true, repoResponse);
        let page_num = 1;

        //update contributors
        
        while (true){
          let contributorResponse = await this.octokit.request("GET /repos/{owner}/{repo}/contributors", {
            owner: owner,
            repo: repo,
            page: page_num,
            per_page: 100
          });//get each page
          if(page_num > 40 || contributorResponse.data.length == 0) {
            console.log(page_num);
            page_num = 1;
            break;
          }
          await this.updateOrAddUsers(contributorResponse, project, page_num == 1);
          page_num ++;
        }//only fetch detailed info for the first 100 contributors

        let allNewFetched = false;
        /* 完成commit的更新*/
        while (true){
          let commitsResponse = await this.octokit.request("GET /repos/{owner}/{repo}/commits", {
            owner: owner,
            repo: repo,
            page: page_num,
            per_page: 100,
            // since: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000).toString(),//within one year
          })
          if(page_num > 100 || commitsResponse.data.length == 0) {
            console.log(page_num);
            page_num = 1;
            break;
          }
          for (const commit of commitsResponse.data) {//for each page, get each commit
            let commitStorage;
            try{
              commitStorage = await this.commitRepository.findById(commit.sha);
            } catch (Error){
              if(Error instanceof EntityNotFoundError) commitStorage = null;
              else throw Error;
            }
            if(!commitStorage){
              let name = commit.author ? commit.author.login : ( commit.commit.author ? commit.commit.author.name : 'test');
              if(!name) name = 'empty';
              await this.commitRepository.create({
                sha: commit.sha,
                url: commit.html_url,
                author_id: commit.author ? commit.author.id : undefined,
                author_name: name,
                author_email: commit.commit.author ? commit.commit.author.email:'',
                updated_at: commit.commit.author ? commit.commit.author.date : '2020-12-20T17:44:07Z',//it is supposed not to be a null value
                message: commit.commit.message,
                repos_id: repoResponse.data.id
              });
            } else {//only get new commits, no updates
              // allNewFetched = true;
              // break;
            }
            // if(allNewFetched) break;
          }
          page_num ++;
        }

        //update issues along with labels
        while (true){
          let issuesResponse = await this.octokit.request("GET /repos/{owner}/{repo}/issues", {
            owner: owner,
            repo: repo,
            state: 'all',
            per_page: 100,
            page: page_num,
            since: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000).toString()
          });
          page_num ++;
          if(page_num > 60 || issuesResponse.data.length == 0){
            console.log(page_num);
            page_num = 1;
            break;
          }
          for (const issue of issuesResponse.data) {
            let issueStorage;
            try{
              issueStorage = await this.issueRepository.findById(issue.id);
            } catch (Error){
              if(Error instanceof EntityNotFoundError) issueStorage = null;
              else throw Error;
            }

            if(!issueStorage){

              issueStorage = await this.issueRepository.create({
                id: issue.id,
                number: issue.number,
                url: issue.html_url,
                title: issue.title,
                state: issue.state,
                is_locked: issue.locked,
                body: issue.body? issue.body: 'test',
                created_at: issue.created_at,
                updated_at: issue.updated_at,
                closed_at: issue.closed_at ? issue.closed_at : undefined,
                comment_count: issue.comments,
                repos_id: repoResponse.data.id,
                user_id: issue.user ? issue.user.id : 65600975,
                user_name: issue.user ? issue.user.login : 'pytorch',
              });

              await this.issueRepository.save(issueStorage);

              let user;
              try{
                user = await this.githubUserRepository.findById(<number>issueStorage.user_id);
              } catch (Error){
                if(Error instanceof EntityNotFoundError) user = null;
                else throw Error;
              }
              if(!user && issue.user){//if contributor is not stored
                let orgResponse = await this.octokit.request("GET /users/{username}/orgs", {
                  username: issue.user.login
                })
                user = await this.githubUserRepository.create({
                  id: issue.user.id,
                  login_name: issue.user.login,
                  avatar_url: issue.user.avatar_url,
                  url: issue.user.html_url,
                  email: 'test',
                  bio: '',
                  followers_count: 0,
                  following_count: 0,
                  created_at: new Date().toString(),
                  updated_at: new Date().toString(),
                  public_repos_count: 0,
                  isOrg: false,
                  display: false,
                  contributesFor: [project],
                  org_name: []
                });
                for (const org of orgResponse.data) {
                  if(!user.org_name) user.org_name = [];
                  user.org_name.push(org.login);
                }
                await this.githubUserRepository.save(user);
              }
            } else {
              issueStorage.state = issue.state;
              issueStorage.updated_at = issue.updated_at;
              issueStorage.closed_at = issue.closed_at ? issue.closed_at : undefined;
              await this.issueRepository.save(issueStorage);
            }
            for (const label of issue.labels) {
              if(typeof label != "string"){
                let labelStorage = await this.labelRepository.findOne({where: {id: (<number>(label.id)).toString()}});
                if(!labelStorage) await this.labelRepository.create({
                  id: (<number>label.id).toString(),
                  name: label.name,
                  description: label.description ? label.description:'',
                  issueId: [issue.id],
                  color: label.color? label.color : ''
                });
                else {
                  if(!labelStorage.issueId.includes(issue.id)){
                    labelStorage.issueId.push(issue.id);
                    await this.labelRepository.save(labelStorage);
                  }
                }
              }
            }
          }
        }

        //update PRs
        while (true) {
          let pullResponse = await this.octokit.request("GET /repos/{owner}/{repo}/pulls", {
            owner: owner,
            repo: repo,
            state: 'all',
            per_page: 100,
            page: page_num,
            since: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000).toString()
          });
          if(pullResponse.data.length == 0){
            console.log(page_num);
            page_num = 1;
            break;
          }

          for (const pull of pullResponse.data) {
            let pullStorage;
            try{
              pullStorage = await this.pullRepository.findById(pull.id);
            } catch (Error){
              if(Error instanceof EntityNotFoundError) pullStorage = null;
              else throw Error;
            }
            if(!pullStorage){
              pullStorage = await this.pullRepository.create({
                id: pull.id,
                url: pull.html_url,
                number: pull.number,
                state: pull.state,
                title: pull.title,
                isLocked: pull.locked,
                body: pull.body? pull.body : 'test',
                created_at: pull.created_at,
                updated_at: pull.updated_at,
                closed_at: pull.closed_at? pull.closed_at:undefined,
                merged_at: pull.merged_at? pull.merged_at:undefined,
                is_merged: pull.merged_at != null,
                repos_id: repoResponse.data.id,
                pr_sender_id: pull.user ? pull.user.id : 65600975,
                pr_sender_name: pull.user ? pull.user.login : 'pytorch',
                // label_ids: [];
              });
            } else{
              pullStorage.state = pull.state;
              pullStorage.isLocked = pull.locked;
              pullStorage.body = pull.body? pull.body : 'test';
              pullStorage.title = pull.title;
              pullStorage.updated_at = pull.updated_at;
              pullStorage.closed_at = pull.closed_at? pull.closed_at:undefined;
              pullStorage.is_merged = pull.merged_at != null;
              await this.pullRepository.save(pullStorage);
            }
          }
          page_num ++;
        }


      }
    } catch (Error){
        console.log(Error.stack);
        return false;
    }
    return true;
  }

  async addOrUpdateRepos(isCore: boolean, projectResponse: Endpoints["GET /repos/{owner}/{repo}"]["response"]){
    let project = projectResponse.data
    let owner = project.owner.login;
    let repo = project.name;
    let projInfo;
    try{
      projInfo = await this.repoRepository.findOne({where: {full_name: project.full_name}});
    } catch (Error){
      if (Error instanceof EntityNotFoundError) projInfo = null;
      else throw Error;
    }
    const lang = await this.octokit.request("GET /repos/{owner}/{repo}/languages", {
      owner: owner,
      repo: repo,
    });
    if (!projInfo) {
      await this.repoRepository.create({
        proj_name: project.name,
        id: project.id,
        url: project.html_url,
        full_name: project.full_name,
        description: project.description == null ? undefined : project.description,
        star_num: project.stargazers_count,
        language: project.language == null ? undefined : project.language,
        language_stat: lang.data,
        open_issues_count: project.open_issues_count,
        forks_count: project.forks_count,
        watchers_count: project.watchers_count,
        created_at: project.created_at,
        updated_at: project.updated_at,
        pushed_at: project.pushed_at,
        topics: project.topics,
        default_branch: project.default_branch,
        isCoreProject: isCore,
        owner_id: project.owner.id
      });
    }
    else{//only update the fields that might change
      projInfo.description = project.description == null ? undefined : project.description;
      projInfo.star_num = project.stargazers_count;
      projInfo.language = project.language == null ? undefined : project.language;
      projInfo.language_stat = lang.data;
      projInfo.open_issues_count = project.open_issues_count;
      projInfo.forks_count = project.forks_count;
      projInfo.watchers_count = project.watchers_count;
      projInfo.created_at = project.created_at;
      projInfo.updated_at = project.updated_at;
      projInfo.pushed_at = project.pushed_at;
      projInfo.topics = project.topics;
      projInfo.homepage = project.homepage == null ? undefined : project.homepage;
    }
  }

  async updateOrAddUsers(userResponses: Endpoints["GET /repos/{owner}/{repo}/contributors"]["response"], project: string | undefined, display: boolean){
    let index = 0;
    for (const contributor of userResponses.data)
    {
      index ++;
      let userResponse, contribStorage;
      if(display && index <= 20) userResponse = await this.octokit.request("GET /users/{username}", {username: <string>contributor.login});
      try{
         contribStorage = await this.githubUserRepository.findById(<number>contributor.id);
      } catch (Error){
        if(Error instanceof EntityNotFoundError) contribStorage = null;
        else throw Error;
      }
      let organizationResponse = await this.octokit.request("GET /users/{username}/orgs", {username: <string>contributor.login});
      let orgs = [];
      for (const org of organizationResponse.data) {
        orgs.push(org.login);
      }
      if (!contribStorage) {//if that user is not in db, add it
        await this.githubUserRepository.create({
          login_name: <string>contributor.login,
          id: <number>contributor.id,
          avatar_url: <string>contributor.avatar_url,
          url: <string>contributor.html_url,
          name: '',
          email: 'test',
          //@ts-ignore
          bio: display ? (userResponse.data.bio == undefined? '' : (<string>userResponse.data.bio)):'',
          followers_count: 0,
          following_count: 0,
          created_at: new Date().toString(),
          updated_at: new Date().toString(),
          public_repos_count: 0,
          isOrg: false,
          org_name: orgs,
          contributesFor: project ? [project] : [],
          display: display && index <= 20
        });
      } else {//else only update necessary fields
        if(display && index <= 20) {
          // @ts-ignore
          contribStorage.updated_at = <string>userResponse.data.updated_at;
          // @ts-ignore
          contribStorage.bio = userResponse.data.bio == null ? '' : <string>contributor.bio;
          // @ts-ignore
          contribStorage.followers_count = <number>userResponse.data.followers;
          // @ts-ignore
          contribStorage.following_count = <number>userResponse.data.following;
          // @ts-ignore
          contribStorage.public_repos_count = <number>userResponse.data.public_repos;
        }
        contribStorage.org_name = orgs;
        contribStorage.display = display && index <= 20;
        await this.githubUserRepository.save(contribStorage);
      }
      if(display && index <= 20){
        let personalRepoResponse = await this.octokit.request("GET /users/{username}/repos", {username: <string>contributor.login});
        for (const repo of personalRepoResponse.data) {
          let repoResponse;
          try{
            repoResponse = await this.octokit.request("GET /repos/{owner}/{repo}", {
              owner: <string>contributor.login,
              repo: repo.name
            });
          } catch (Error) {
            if(Error.status >= '400' && Error.status < '500'){
              continue;
            } else throw Error;
          }

          await this.addOrUpdateRepos(false, repoResponse);
        }
      }
    }
  }
}

