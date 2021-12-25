import {repository,} from '@loopback/repository';
import {get, HttpErrors, param, response, ResponseObject,} from '@loopback/rest';
import {
  CommentsIssueRepository,
  CommitRepository,
  GithubUserRepository,
  IssueRepository,
  ProjRepoRepository,
  PullRepository,
  UserExtensionRepository
} from '../repositories';
import {SecurityBindings, securityId, UserProfile} from "@loopback/security";
import {authenticate} from "@loopback/authentication";
import {inject} from "@loopback/core";
import {UserRepository} from "@loopback/authentication-jwt";

const MEMBER_COMPOSE: ResponseObject = {
  description: 'The member composition of a project',
  content: {
    'application/json': {
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {type: "string"},
            value: {type: "number"},
          }
        }
      }
    }
  }
}

export const MEMBER_PROJ: ResponseObject = {
  description: 'All projects of a member',
  content: {
    'application/json': {
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {type: "string"},
            description: {type: "string"},
            major: {type: "string"},
            stars: {type: "number"},
            lastUpdate: {type: "string"}
          }
        }
      }
    }
  }
}

export const ALL_MEMBERS: ResponseObject = {
  description: 'All members of the community (all contributors of a repository',
  content: {
    'application/json': {
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {type: "string"},
            avatar: {type: "string"},
            description: {type: "string"},
          }
        }
      }
    }
  }
}

const MEMBER_EVENTS: ResponseObject = {
  description: 'The actions of members such as commit, issue & pr',
  content: {
    'application/json': {
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            time: {type: "string"},
            event: {type: "string"},
            memberName: {type: "string"},
          }
        }
      }
    }
  }
}

export type project = {
  name: string,
  description: string,
  major: string,
  stars: number,
  lastUpdate: string,
};

export class MemberController {
  constructor(
    @repository(GithubUserRepository)
    public githubUserRepository : GithubUserRepository,
    @repository(ProjRepoRepository)
    protected projRepoRepository: ProjRepoRepository,
    @repository(UserExtensionRepository)
    protected userExtensionRepository: UserExtensionRepository,
    @repository(CommitRepository)
    protected commitRepository: CommitRepository,
    @repository(PullRepository)
    protected pullRepository: PullRepository,
    @repository(IssueRepository)
    protected issueRepository: IssueRepository,
    @repository(CommentsIssueRepository)
    protected commentsIssueRepository: CommentsIssueRepository,
    @repository(UserRepository)
    protected userRepository: UserRepository
  ) {}

  @authenticate('jwt')
  @get('/member/compose')
  @response(200, MEMBER_COMPOSE)
  async memberCompose(
      @param.query.string('projectName') projectName: string,
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<{name: string, value: number}[]>{
    let currentUserID = currentUserProfile[securityId];
    let currentUser = await this.userRepository.findById(currentUserID, {fields: ["email"]});
    // console.log(currentUser);
    let permitViewList = await this.userExtensionRepository.findOne({where: {email: currentUser.email}, fields: ['repo_view_list', 'is_admin']});
    if(!permitViewList?.repo_view_list.includes(projectName) && !permitViewList?.is_admin){
      throw new HttpErrors.NotFound('Repository not found.');
    }

    let repo = await this.projRepoRepository.findOne({where: {full_name: projectName}, fields: ["id", "full_name"]});
    // console.log(repo);
    if(typeof repo === null){
      throw new HttpErrors.InternalServerError('The repository data is missing.');
    }
    let result = [{
      name: 'individual',
      value: 0,
    },{
      name: projectName.split('/')[0],
      value: 0,
    }];

    let contributors = await this.githubUserRepository.find({fields: ["contributesFor", "org_name"]});
    for (const contributor of contributors) {
      if(contributor.contributesFor?.includes(projectName)){
        if(contributor.org_name === undefined || contributor.org_name.length == 0){
          result[0].value++;
          continue;
        }
        if(contributor.org_name.includes(result[1].name)){
          result[1].value++;
          continue;
        }
        for(const org of contributor.org_name){
          let i;
          for(i = 0; i < result.length; i++){
            if(result[i].name == org){
              result[i].value++;
              break;
            }
          }
          if(i == result.length){
            result.push({
              name: org,
              value: 1
            });
          }
        }
      }
    }
  
    let resultNew : typeof result = [{
      name: 'others',
      value: 0,
    }];
    result.forEach(org => {//display organization with too little contributor together as 'others'
      if(org.value / contributors.length >= 0.01){
        resultNew.push(org);
      }
      else resultNew[0].value += org.value;
    });  

    // let prSender = await this.projRepoRepository.pr_sender(<number>repo?.id).find({fields: ["org_name", "id"]});
    // let issueSender = await this.projRepoRepository.issue_adder(<number>repo?.id).find({fields: ["org_name", "id"]});
    // let allCommits = await this.commitRepository.find({where: {repos_id: repo?.id}, fields: ["author_id", "author_email"]});
    // let memberList = prSender;
    // let unregisteredMemberList: string[] = [];
    // for (let i = 0; i < issueSender.length; i++) {
    //   if(!memberList.includes(issueSender[i])){
    //     memberList.push(issueSender[i]);
    //   }
    // }
    // for (let i = 0; i < allCommits.length; i++){
    //   if(allCommits[i].author_id != undefined){
    //     let committer = await this.githubUserRepository.findById(<number>allCommits[i].author_id, {fields: ["org_name", "id"]});
    //     if(typeof committer === null){
    //       throw new HttpErrors.InternalServerError('Try after updating the data');
    //     }
    //     if(!memberList.includes(<GithubUser>committer)){
    //         memberList.push(<GithubUser>committer);
    //     }
    //   }
    //   else {
    //     if(unregisteredMemberList.includes(<string>allCommits[i].author_email)){
    //       result[1].value ++;
    //       unregisteredMemberList.push(<string>allCommits[i].author_email);
    //     }
    //   }
    // }

    // for (let i = 0; i < memberList.length; i++) {
    //   if(memberList[i].org_name === undefined) memberList[i].org_name = [];
    //   // @ts-ignore
    //   if(memberList[i].org_name.length === 0){
    //     result[0].value ++;
    //     continue;
    //   }
    //   // @ts-ignore
    //   memberList[i].org_name.forEach(item => {
    //     let j;
    //     for (j = 0; j < result.length; j++) {
    //       if(result[j].name == item){
    //         result[j].value++;
    //         break;
    //       }
    //     }
    //     if(j === result.length)
    //       result.push({
    //         name: item,
    //         value: 1,
    //       });
    //   });
    // }
    return resultNew;
  }

  @authenticate('jwt')
  @get('/member/projects')
  @response(200, MEMBER_PROJ)
  async memberProject(
      @param.query.string('userid') memberName: string,
  ): Promise<project[]>{
    let result: project[] = [];
    let member = await this.githubUserRepository.findOne({where: {login_name: memberName}, fields: ["id"]});
    if(!memberName || typeof member === null){
      throw new HttpErrors.NotFound('Member not found. Is this name a login name of GitHub user?');
    }
    let repos = await this.projRepoRepository.find({where: {owner_id: member?.id}, fields: ["full_name", "updated_at", "description", "star_num", "language"], order: ["updated_at DESC"]});
    for (const repo of repos) {
      if(typeof repo.description === undefined) repo.description = 'SRE is so interesting!';
      if(repo.language === undefined) repo.language = 'typescript';
      result.push({
        name: repo.full_name,
        description: <string>repo.description,
        major: <string>repo.language,
        stars: repo.star_num,
        lastUpdate: repo.updated_at,
      });
    }
    return result;
  }

  @authenticate('jwt')
  @get('/member/members')
  @response(200, ALL_MEMBERS)
  async projectMembers(
      @param.query.string('projectName') projectName: string,
      @inject(SecurityBindings.USER)
                currentUserProfile: UserProfile,
  ): Promise<{name: string, avatar: string, description: string}[]>{
    let currentUserID = currentUserProfile[securityId];
    let currentUser = await this.userRepository.findById(currentUserID, {fields: ["email"]});
    let permitViewList = await this.userExtensionRepository.findOne({where: {email: currentUser.email}, fields: ['repo_view_list', 'is_admin']});
    if(!permitViewList?.repo_view_list.includes(projectName) && !permitViewList?.is_admin){
      throw new HttpErrors.NotFound('Repository not found.');
    }
    let repo = await this.projRepoRepository.findOne({where: {full_name: projectName}, fields: ["id"]});
    if(typeof repo === null){
      throw new HttpErrors.InternalServerError('The repository data is missing.');
    }
    // let prSenders = await this.projRepoRepository.pr_sender(<number>repo?.id).find({fields: ["login_name", "avatar_url", "bio"]});
    // let issueSenders = await this.projRepoRepository.issue_adder(<number>repo?.id).find({fields: ["login_name", "avatar_url", "bio"]});
    // let allCommits = await this.commitRepository.find({where: {repos_id: repo?.id}, fields: ["author_id", "author_email", "author_name"]});
    let result: {name: string, avatar: string, description: string}[] = [];
    let contributors = await this.githubUserRepository.find({where: {display: true}, fields: ["login_name", "avatar_url", "bio", "contributesFor"]});
    for (const contributor of contributors) {
      if((<string[]>(contributor.contributesFor)).includes(projectName)){
        let member = {
          name: contributor.login_name,
          avatar: contributor.avatar_url,
          description: contributor.bio === undefined? '' : contributor.bio,
        };
        // if(member.description.length === 0) member.description = '我爱万志远';//placeholder
        if(!result.includes(member)){
          result.push(member);
        }
      }
    }
    // for (const prSender of prSenders) {
    //   let member = {
    //     name: prSender.login_name,
    //     avatar: prSender.avatar_url,
    //     description: prSender.bio,
    //   };
    //   if(member.description.length === 0) member.description = '我爱万志远';//placeholder
    //   if(!result.includes(member)){
    //     result.push(member);
    //   }
    // }
    // for (const issueSender of issueSenders) {
    //   let member = {
    //     name: issueSender.login_name,
    //     avatar: issueSender.avatar_url,
    //     description: issueSender.bio,
    //   };
    //   if(member.description.length === 0) member.description = '我爱万志远';
    //   if (!result.includes(member)){
    //     result.push(member);
    //   }
    // }
    // for (const commit of allCommits) {
    //   if(commit.author_id != undefined){
    //     let committer = await this.githubUserRepository.findById(commit.author_id, {fields: ["login_name", "avatar_url", "bio"]});
    //     if(typeof committer === null){
    //       throw new HttpErrors.InternalServerError('Try after updating data.');
    //     }
    //     let member = {
    //       name: committer.login_name,
    //       avatar: committer.avatar_url,
    //       description: committer.bio,
    //     };
    //     if(member.description.length === 0) member.description = '我爱万志远';
    //     if(!result.includes(member)){
    //       result.push(member);
    //     }
    //   }
    // }

    return result;
  }

  @authenticate('jwt')
  @get('/member/events')
  @response(200, MEMBER_EVENTS)
  async memberEvents(
      @param.query.string('projectName') projectName: string,
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ):Promise<{time: string, event: string, memberName: string}[]>{
    let currentUserID = currentUserProfile[securityId];
    let currentUser = await this.userRepository.findById(currentUserID, {fields: ["email"]});
    let permitViewList = await this.userExtensionRepository.findOne({where: {email: currentUser.email}, fields: ['repo_view_list', 'is_admin']});
    if(!permitViewList?.repo_view_list.includes(projectName) && !permitViewList?.is_admin){
      throw new HttpErrors.NotFound('Repository not found.');
    }
    let result: {time: string, event: string, memberName: string}[] = [];
    let repo = await this.projRepoRepository.findOne({where: {full_name: projectName}, fields: ["id"]});
    if(typeof repo === null){
      throw new HttpErrors.InternalServerError('The repository data is missing.');
    }
    let allCommit = await this.commitRepository.find({where: {repos_id: repo?.id}, fields: ["updated_at", "author_id", "author_name"], limit: 10});
    for (const commit of allCommit) {
      result.push({
        time: commit.updated_at,
        event: commit.author_name + " submits 1 commit to the project.",
        memberName: commit.author_name,
      });
    }
    let allPr = await this.pullRepository.find({where: {repos_id: repo?.id}, fields: ["created_at", "closed_at", "merged_at", "updated_at", "merged_by_user", "pr_sender_name", "is_merged", "state"], limit: 10});
    for (const PR of allPr) {
      result.push({
        time: PR.created_at,
        event: PR.pr_sender_name + " opens 1 pull request.",
        memberName: PR.pr_sender_name,
      });
      if(PR.state === 'closed'){
        if (PR.is_merged) {
          result.push({
            time: <string>PR.merged_at,
            event: '1 pull request of ' + PR.pr_sender_name + ' is merged',
            memberName: <string>PR.pr_sender_name,
          });
        }
        else {
          result.push({
            time: <string>PR.closed_at,
            event: 'One pull request of ' + PR.pr_sender_name + ' is closed and not merged.',
            memberName: PR.pr_sender_name,
          });
        }
      }
      else if(PR.created_at != PR.updated_at){
        result.push({
          time: <string>PR.updated_at,
          event: 'One pull request of ' + PR.pr_sender_name + ' is updated.',
          memberName: PR.pr_sender_name,
        });
      }
    }
    let allIssues = await this.issueRepository.find({where: {repos_id: repo?.id}, fields: ["created_at", "closed_at", "state", "user_name"], limit: 10});
    for (const issue of allIssues) {
      result.push({
        time: issue.created_at,
        event: issue.user_name + ' opens one issue.',
        memberName: issue.user_name,
      });
      if(issue.state === 'open' && issue.updated_at != issue.created_at){
        result.push({
          time: issue.updated_at,
          event: 'One issue of ' + issue.user_name + ' is updated.',
          memberName: issue.user_name,
        });
      }
      else if(issue.state === 'closed'){
        result.push({
          time: <string>issue.closed_at,
          event: 'One issue of ' + issue.user_name + ' is closed.',
          memberName: issue.user_name,
        });
      }
    }
    return result.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }

}
