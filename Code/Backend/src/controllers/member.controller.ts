import {repository,} from '@loopback/repository';
import {get, HttpErrors, param, response, ResponseObject,} from '@loopback/rest';
import {GithubUser} from '../models';
import {
  CommentsIssueRepository,
  CommitRepository,
  GithubUserRepository,
  IssueRepository,
  ProjRepoRepository,
  PullRepository,
  UserExtensionRepository
} from '../repositories';
import {SecurityBindings, UserProfile} from "@loopback/security";
import {authenticate} from "@loopback/authentication";
import {inject} from "@loopback/core";

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

const MEMBER_PROJ: ResponseObject = {
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

const ALL_MEMBERS: ResponseObject = {
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
    protected commentsIssueRepository: CommentsIssueRepository
  ) {}

  @authenticate('jwt')
  @get('/member/compose')
  @response(200, MEMBER_COMPOSE)
  async memberCompose(
      @param.query.string('projectName') projectName: string,
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<{name: string, value: number}[]>{
    let currentUserEmail = currentUserProfile["email"];
    let permitViewList = await this.userExtensionRepository.findOne({where: {email: currentUserEmail}, fields: ['repo_view_list', 'is_admin']});
    if(!permitViewList?.repo_view_list.includes(projectName) && !permitViewList?.is_admin){
      throw new HttpErrors.Forbidden('You don\'t have the permission to view this repo.');
    }
    let result = [{
      name: 'individual',
      value: 0,
    }]

    let repo = await this.projRepoRepository.findOne({where: {full_name: projectName}, fields: ["id"]});
    let prSender = await this.projRepoRepository.pr_sender(<number>repo?.id).find({fields: ["org_name", "id"]});
    let issueSender = await this.projRepoRepository.issue_adder(<number>repo?.id).find({fields: ["org_name", "id"]});
    let allCommits = await this.commitRepository.find({where: {repos_id: repo?.id}, fields: ["author_id", "author_email"]});
    let memberList = prSender;
    let unregisteredMemberList: string[] = [];
    for (let i = 0; i < issueSender.length; i++) {
      if(!memberList.includes(issueSender[i])){
        memberList.push(issueSender[i]);
      }
    }
    for (let i = 0; i < allCommits.length; i++){
      if(allCommits[i].author_id != undefined){
        let committer = await this.githubUserRepository.findById(<number>allCommits[i].author_id, {fields: ["org_name", "id"]});
        if(!memberList.includes(<GithubUser>committer)){
            memberList.push(<GithubUser>committer);
        }
      }
      else {
        if(unregisteredMemberList.includes(<string>allCommits[i].author_email)){
          result[0].value ++;
          unregisteredMemberList.push(<string>allCommits[i].author_email);
        }
      }
    }

    for (let i = 0; i < memberList.length; i++) {
      if(memberList[i].org_name.length === 0){
        result[0].value ++;
        continue;
      }
      memberList[i].org_name.forEach(item => {
        let j;
        for (j = 0; j < result.length; j++) {
          if(result[j].name == item){
            result[j].value++;
            break;
          }
        }
        if(j === result.length)
          result.push({
            name: item,
            value: 1,
          });
      });
    }
    return result;
  }

  @authenticate('jwt')
  @get('/member/projects')
  @response(200, MEMBER_PROJ)
  async memberProject(
      @param.query.string('memberName') memberName: string,
  ): Promise<{
    name: string,
    description: string,
    major: string,
    stars: number,
    lastUpdate: string
  }[]>{
    let result = [];
    let member = await this.githubUserRepository.findOne({where: {login_name: memberName}, fields: ["id"]});
    let repos = await this.projRepoRepository.find({where: {owner_id: member?.id}, fields: ["proj_name", "updated_at", "description", "star_num", "language"]});
    for (const repo of repos) {
      result.push({
        name: repo.proj_name,
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
    let currentUserEmail = currentUserProfile["email"];
    let permitViewList = await this.userExtensionRepository.findOne({where: {email: currentUserEmail}, fields: ['repo_view_list', 'is_admin']});
    if(!permitViewList?.repo_view_list.includes(projectName) && !permitViewList?.is_admin){
      throw new HttpErrors.Forbidden('You don\'t have the permission to view this repo.');
    }
    let repo = await this.projRepoRepository.findOne({where: {full_name: projectName}, fields: ["id"]});
    let prSenders = await this.projRepoRepository.pr_sender(<number>repo?.id).find({fields: ["login_name", "avatar_url", "bio"]});
    let issueSenders = await this.projRepoRepository.issue_adder(<number>repo?.id).find({fields: ["login_name", "avatar_url", "bio"]});
    let allCommits = await this.commitRepository.find({where: {repos_id: repo?.id}, fields: ["author_id", "author_email", "author_name"]});
    let result: {name: string, avatar: string, description: string}[] = [];
    for (const prSender of prSenders) {
      let member = {
        name: prSender.login_name,
        avatar: prSender.avatar_url,
        description: prSender.bio,
      };
      if(member.description.length === 0) member.description = '我爱万志远';
      if(!result.includes(member)){
        result.push(member);
      }
    }
    for (const issueSender of issueSenders) {
      let member = {
        name: issueSender.login_name,
        avatar: issueSender.avatar_url,
        description: issueSender.bio,
      };
      if(member.description.length === 0) member.description = '我爱万志远';
      if (!result.includes(member)){
        result.push(member);
      }
    }
    for (const commit of allCommits) {
      if(commit.author_id != undefined){
        let committer = await this.githubUserRepository.findById(commit.author_id, {fields: ["login_name", "avatar_url", "bio"]});
        let member = {
          name: committer.login_name,
          avatar: committer.avatar_url,
          description: committer.bio,
        };
        if(member.description.length === 0) member.description = '我爱万志远';
        if(!result.includes(member)){
          result.push(member);
        }
      }
    }
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
    let currentUserEmail = currentUserProfile["email"];
    let permitViewList = await this.userExtensionRepository.findOne({where: {email: currentUserEmail}, fields: ['repo_view_list', 'is_admin']});
    if(!permitViewList?.repo_view_list.includes(projectName) && !permitViewList?.is_admin){
      throw new HttpErrors.Forbidden('You don\'t have the permission to view this repo.');
    }
    let result: {time: string, event: string, memberName: string}[] = [];
    let repo = await this.projRepoRepository.findOne({where: {full_name: projectName}, fields: ["id"]});
    let allCommit = await this.commitRepository.find({where: {repos_id: repo?.id}, fields: ["updated_at", "author_id", "author_name"]});
    for (const commit of allCommit) {
      let name: string;
      if(commit.author_id != undefined){
        let member = await this.githubUserRepository.findById(commit.author_id, {fields: ["login_name"]});
        name = member.login_name;
      }
      else name = commit.author_name;
      result.push({
        time: commit.updated_at,
        event: name + " submits 1 commit to the project.",
        memberName: name,
      });
    }
    let allPr = await this.pullRepository.find({where: {repos_id: repo?.id}, fields: ["created_at", "closed_at", "merged_at", "updated_at", "merged_by_user", "pr_sender_name", "is_merged", "state"]});
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
            event: <string>PR.merged_by_user + ' merges 1 pull request of ' + PR.pr_sender_name,
            memberName: <string>PR.merged_by_user,
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
    let allIssues = await this.issueRepository.find({where: {repos_id: repo?.id}, fields: ["created_at", "closed_at", "state", "user_name"]});
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

  // @authenticate('jwt')
  // @get('/member/events')
  // @response(200)
  // async memberEvents():

  // @post('/member')
  // @response(200, {
  //   description: 'GithubUser model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(GithubUser)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(GithubUser, {
  //           title: 'NewGithubUser',
  //
  //         }),
  //       },
  //     },
  //   })
  //   githubUser: GithubUser,
  // ): Promise<GithubUser> {
  //   return this.githubUserRepository.create(githubUser);
  // }
  //
  // @get('/member/count')
  // @response(200, {
  //   description: 'GithubUser model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(
  //   @param.where(GithubUser) where?: Where<GithubUser>,
  // ): Promise<Count> {
  //   return this.githubUserRepository.count(where);
  // }
  //
  // @get('/member')
  // @response(200, {
  //   description: 'Array of GithubUser model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(GithubUser, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(GithubUser) filter?: Filter<GithubUser>,
  // ): Promise<GithubUser[]> {
  //   return this.githubUserRepository.find(filter);
  // }
  //
  // @patch('/member')
  // @response(200, {
  //   description: 'GithubUser PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(GithubUser, {partial: true}),
  //       },
  //     },
  //   })
  //   githubUser: GithubUser,
  //   @param.where(GithubUser) where?: Where<GithubUser>,
  // ): Promise<Count> {
  //   return this.githubUserRepository.updateAll(githubUser, where);
  // }
  //
  // @get('/member/{id}')
  // @response(200, {
  //   description: 'GithubUser model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(GithubUser, {includeRelations: true}),
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.number('id') id: number,
  //   @param.filter(GithubUser, {exclude: 'where'}) filter?: FilterExcludingWhere<GithubUser>
  // ): Promise<GithubUser> {
  //   return this.githubUserRepository.findById(id, filter);
  // }
  //
  // @patch('/member/{id}')
  // @response(204, {
  //   description: 'GithubUser PATCH success',
  // })
  // async updateById(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(GithubUser, {partial: true}),
  //       },
  //     },
  //   })
  //   githubUser: GithubUser,
  // ): Promise<void> {
  //   await this.githubUserRepository.updateById(id, githubUser);
  // }
  //
  // @put('/member/{id}')
  // @response(204, {
  //   description: 'GithubUser PUT success',
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() githubUser: GithubUser,
  // ): Promise<void> {
  //   await this.githubUserRepository.replaceById(id, githubUser);
  // }
  //
  // @del('/member/{id}')
  // @response(204, {
  //   description: 'GithubUser DELETE success',
  // })
  // async deleteById(@param.path.number('id') id: number): Promise<void> {
  //   await this.githubUserRepository.deleteById(id);
  // }
}
