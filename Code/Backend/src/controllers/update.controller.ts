import {inject} from '@loopback/core';
import {ProjRepoRepository, UserExtensionRepository, IssueRepository, PullRepository, CommitRepository, LabelRepository} from '../repositories';
import { get, HttpErrors, response } from '@loopback/rest';
import {authenticate} from "@loopback/authentication";
import {SecurityBindings, securityId, UserProfile} from "@loopback/security";
import {repository} from "@loopback/repository";
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
      @repository(UserRepository)
      protected userRepository: UserRepository,
      protected octokit = new Octokit(),

  ) {}

  @authenticate('jwt')
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
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<boolean>{
    let currentUserID = currentUserProfile[securityId];
    let currentUser = await this.userRepository.findById(currentUserID, {fields: ["email"]});
    let permitViewList = await this.userExtensionRepository.findOne({where: {email: currentUser.email}, fields: ['repo_view_list', 'is_admin']});
    if(!permitViewList) return true;
    try{
      for (const project of <string[]>permitViewList?.repo_view_list) {

        let owner = project.split('/')[0];
        let repo = project.split('/')[1];
        const repoResponse = await this.octokit.request("GET /repos/{owner}/{repo}", {
          owner: project.split('/')[0],
          repo: project.split('/')[1],
        });

        /*完成projrepo表的更新 */
        await this.addOrUpdateRepos(true, repoResponse);

        // update contributors
        let page_num = 1;
        while (true){
          let contributorResponse = await this.octokit.request("GET /repos/{owner}/{repo}/contributors", {
            owner: owner,
            repo: repo,
            page: page_num,
            per_page: 100
          });//get each page
          if(page_num > 40 || contributorResponse.data.length == 0) {
            page_num = 0;
            break;
          }
          page_num ++;
          await this.updateOrAddUsers(contributorResponse, project, page_num == 1);
        }//only fetch detailed info for the first 100 contributors

        let allNewFetched = false;
        /* 完成commit的更新*/
        while (true){
          let commitsResponse = await this.octokit.request("GET /repos/{owner}/{repo}/commits", {
            owner: owner,
            repo: repo,
            page: page_num,
            per_page: 100,
            since: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000).toTimeString(),//within one year
          })
          if(page_num > 100 || commitsResponse.data.length == 0) {
            page_num = 0;
            break;
          }
          page_num ++;
          for (const commit of commitsResponse.data) {//for each page, get each commit
            let commitStorage = await this.commitRepository.findById(commit.sha);
            if(!commitStorage){
              await this.commitRepository.create({
                sha: commit.sha,
                url: commit.html_url,
                author_id: commit.author ? commit.author.id : undefined,
                author_name: commit.author ? commit.author.login : ( commit.commit.author ?commit.commit.author.name : ''),
                author_email: commit.commit.author ? commit.commit.author.email:'',
                updated_at: commit.commit.author ? commit.commit.author.date : '2020-12-20T17:44:07Z',//it is supposed not to be a null value
                message: commit.commit.message,
                repos_id: repoResponse.data.id
              });
            } else {//only get new commits, no updates
              allNewFetched = true;
              break;
            }
            if(allNewFetched) break;
          }
        }

        //update issues along with labels
        while (true){
          let issuesResponse = await this.octokit.request("GET /repos/{owner}/{repo}/issues", {
            owner: owner,
            repo: repo,
            state: 'all',
            per_page: 100,
            page: page_num,
          });
          if(page_num > 60 || issuesResponse.data.length == 0){
            page_num = 0;
            break;
          }
          for (const issue of issuesResponse.data) {
            let issueStorage = await this.issueRepository.findById(issue.id);

            if(!issueStorage){
              issueStorage = await this.issueRepository.create({
                id: issue.id,
                number: issue.number,
                url: issue.html_url,
                title: issue.title,
                state: issue.state,
                is_locked: issue.locked,
                body: issue.body? issue.body: '',
                created_at: issue.created_at,
                updated_at: issue.updated_at,
                closed_at: issue.closed_at ? issue.closed_at : undefined,
                comment_count: issue.comments,
                repos_id: repoResponse.data.id,
                user_id: issue.user ? issue.user.id : 65600975,
                user_name: issue.user ? issue.user.login : 'pytorch',
              });
              for (const label of issue.labels) {
                if(typeof label != "string")
                  issueStorage.labels.push(new Label({
                    id: <number>label.id,
                    name: <string>label.name,
                    color: <string>label.color,
                    description: <string>label.description,
                  }));
              }
              await this.issueRepository.save(issueStorage);

              let user = await this.githubUserRepository.findById(<number>issueStorage.user_id);
              if(!user && issue.user){//if contributor is not stored
                let orgResponse = await this.octokit.request("GET /users/{username}/orgs", {
                  username: issue.user.login
                })
                user = await this.githubUserRepository.create({
                  id: issue.user.id,
                  login_name: issue.user.login,
                  avatar_url: issue.user.avatar_url,
                  url: issue.user.html_url,
                  email: '',
                  bio: '',
                  followers_count: 0,
                  following_count: 0,
                  created_at: '',
                  updated_at: '',
                  public_repos_count: 0,
                  isOrg: false,
                  display: false,
                  contributesFor: [project],
                  org_name: []
                });
                for (const org of orgResponse.data) {
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
          });
          if(page_num > 60 || pullResponse.data.length == 0){
            page_num = 0;
            break;
          }
          page_num ++;
          for (const pull of pullResponse.data) {
            let pullStorage = await this.pullRepository.findById(pull.id);
            if(!pullStorage){
              pullStorage = await this.pullRepository.create({
                id: pull.id,
                url: pull.html_url,
                number: pull.number,
                state: pull.state,
                title: pull.title,
                isLocked: pull.locked,
                body: pull.body? pull.body : '',
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
              pullStorage.body = pull.body? pull.body : '';
              pullStorage.title = pull.title;
              pullStorage.updated_at = pull.updated_at;
              pullStorage.closed_at = pull.closed_at? pull.closed_at:undefined;
              pullStorage.is_merged = pull.merged_at != null;
              await this.pullRepository.save(pullStorage);
            }
          }
        }


      }
    } catch (Error){
        console.log(Error);
        return false;
    }
    return true;
  }

  async addOrUpdateRepos(isCore: boolean, projectResponse: Endpoints["GET /repos/{owner}/{repo}"]["response"]){
    let project = projectResponse.data
    let owner = project.owner.login;
    let repo = project.name;
    let projInfo = await this.repoRepository.findOne({where: {full_name: project.full_name}});
    if(!projInfo){
      throw new HttpErrors.NotFound();
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
    for (const contributor of userResponses.data)
    {
      let userResponse;
      if(display) userResponse = await this.octokit.request("GET /users/{username}", {username: <string>contributor.login});
      let contribStorage = await this.githubUserRepository.findById(<number>contributor.id);
      let organizationResponse = await this.octokit.request("GET /users/{username}/orgs", {username: <string>contributor.login});
      let orgs = [];
      for (const org of organizationResponse.data) {
        orgs.push(org.login);
      }
      if (!contribStorage) {//if that user is not in db, add it
        // @ts-ignore
        await this.githubUserRepository.create({
          login_name: <string>contributor.login,
          id: <number>contributor.id,
          avatar_url: <string>contributor.avatar_url,
          url: <string>contributor.html_url,
          name: '',
          email: '',
          //@ts-ignore
          bio: display ? (userResponse.data.bio == undefined? '' : (<string>userResponse.data.bio)):'',
          followers_count: 0,
          following_count: 0,
          created_at: '',
          updated_at: '',
          public_repos_count: 0,
          isOrg: false,
          org_name: orgs,
          contributesFor: project ? [] : [project],
          display: display
        });
      } else {//else only update necessary fields
        if(display) {
          // @ts-ignore
          contribStorage.updated_at = <string>userResponse.data.updated_at;
          // @ts-ignore
          contribStorage.bio = userResponse.data.bio == null ? 'Arch BTW' : <string>contributor.bio;
          // @ts-ignore
          contribStorage.followers_count = <number>userResponse.data.followers;
          // @ts-ignore
          contribStorage.following_count = <number>userResponse.data.following;
          // @ts-ignore
          contribStorage.public_repos_count = <number>userResponse.data.public_repos;
        }
        contribStorage.org_name = orgs;
        contribStorage.display = display;
        await this.githubUserRepository.save(contribStorage);
      }
      if(display){
        let personalRepoResponse = await this.octokit.request("GET /users/{username}/repos", {username: <string>contributor.login});
        for (const repo of personalRepoResponse.data) {
          let repoResponse = await this.octokit.request("GET /repos/{owner}/{repo}", {
            owner: <string>contributor.login,
            repo: repo.name
          });
          await this.addOrUpdateRepos(false, repoResponse);
        }
      }
    }
  }
}

