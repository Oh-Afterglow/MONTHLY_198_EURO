import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response, ResponseObject, OperationObject, HttpErrors,
} from '@loopback/rest';
import {Issue, IssueRelations, ProjRepo, Pull, PullRelations} from '../models';
import {ProjRepoRepository, UserExtensionRepository, IssueRepository, PullRepository, CommitRepository, LabelRepository} from '../repositories';
import {authenticate} from "@loopback/authentication";
import {inject} from "@loopback/core";
import {UserRepository} from "@loopback/authentication-jwt";
import {SecurityBindings, securityId, UserProfile} from "@loopback/security";

const PROJECT_COMPOSE: ResponseObject = {
  description: 'The composition of a project',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'ProjectCompose',
        properties: {
          compose: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                names: {
                  type: 'string',
                },
                value: {
                  type: 'number',
                },
              }
            },
          },
        },
      },
    },
  },
}

const PROJECT_NUMBERS: ResponseObject = {
  description: 'The number of issues, commits and PRs',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'ProjectNumbers',
        properties: {
          issue: {type: 'number'},
          commit: {type: 'number'},
          pullRequest: {type: 'number'},
        },
      },
    },
  },
}

const PROJECT_CIP: ResponseObject = {
  description: 'The number of commits / issues / PRs updated per week / month / half year',
  content: {
    'application/json': {
      schema: {
        type: 'array',
        title: 'ProjectCommits',
        items: {
          type: 'object',
          properties: {
            name: {type: 'string'},
            value: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {type: "string"},
                  value: {
                    type: "array",
                    items: {type: "number"},
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}

const IP_SOLVE: ResponseObject = {
  description: 'The number of issues / PRs solved per week / month / half year / year',
  content: {
    'application/json': {
      schema: {
        type: "array",
        items: {type: "number"},
      }
    }
  }
}

const ISSUE_TAGS: ResponseObject = {
  description: 'The number of each tags in issues',
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

export class ProjectInfoController {
  constructor(
    @repository(ProjRepoRepository)
    public projRepoRepository : ProjRepoRepository,
    @repository(UserExtensionRepository)
    protected userExtensionRepository: UserExtensionRepository,
    @repository(CommitRepository)
    protected commitRepository: CommitRepository,
    @repository(IssueRepository)
    protected issueRepository: IssueRepository,
    @repository(PullRepository)
    protected pullRepository: PullRepository,
    @repository(UserRepository)
    protected userRepository: UserRepository,
  ) {}

  @authenticate('jwt')
  @get('/project/compose')
  @response(200, PROJECT_COMPOSE)
  async projectCompose(
      @param.query.string('projectName') projectName: string,
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<{name: string, value: number}[]>{
    console.log('/project/compose');
    let currentUserID = currentUserProfile[securityId];
    let currentUser = await this.userRepository.findById(currentUserID, {fields: ["email"]});
    let permitViewList = await this.userExtensionRepository.findOne({where: {email: currentUser.email}, fields: ['repo_view_list', 'is_admin']});
    if(!permitViewList?.repo_view_list.includes(projectName) && !permitViewList?.is_admin){
      throw new HttpErrors.NotFound('Repository not found.');
    }
    let repo = await this.projRepoRepository.findOne({where: {full_name: projectName}, fields: ['language_stat']});
    if(repo === null){
      throw new HttpErrors.InternalServerError('The repository data is missing.');//The repo is in the list but its data is not in database
    }
    let result = [];
    for(let lang in repo?.language_stat){
      if (repo) {
        result.push({name: lang, value: (repo.language_stat as any)[lang]});
      }
    }
    if(result.length === 0) result.push({name: 'typescript', value: 100});//this is almost impossible
    return result;
  }

  @authenticate('jwt')
  @get('/project/numbers')
  @response(200, PROJECT_NUMBERS)
  async projectNumbers(
      @param.query.string('projectName') projectName: string,
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<{issue: number, commit: number, pullRequest: number}>{
    console.log('/project/numbers');
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
    let commitCount = await this.commitRepository.count({repos_id: repo?.id});
    let issueCount = await this.issueRepository.count({repos_id: repo?.id});
    let prCount = await this.pullRepository.count({repos_id: repo?.id});
    return {
      issue: issueCount.count,
      commit: commitCount.count,
      pullRequest: prCount.count,
    };
  }

  @authenticate('jwt')
  @get('/project/commit')
  @response(200, PROJECT_CIP)
  async projectCommit(
      @param.query.string('projectName') projectName: string,
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<{
    name: string,
    value: { name: string, value: number[] }[],
  }[]>{
    console.log('/project/commit');
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
    let allCommits = await this.commitRepository.find({where: {repos_id: repo?.id}, fields: ["updated_at"]});

    return timeFilter(allCommits);
  }

  @authenticate('jwt')
  @get('/project/issue')
  @response(200, PROJECT_CIP)
  async projectIssue(
      @param.query.string('projectName') projectName: string,
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<{
    name: string,
    value: { name: string, value: number[] }[],
  }[]>{
    console.log('/project/issue');
    let currentUserID = currentUserProfile[securityId];
    let currentUser = await this.userRepository.findById(currentUserID, {fields: ["email"]});
    let permitViewList = await this.userExtensionRepository.findOne({where: {email: currentUser.email}, fields: ['repo_view_list', 'is_admin']});
    if(!permitViewList?.repo_view_list.includes(projectName) && !permitViewList?.is_admin){
      throw new HttpErrors.NotFound('You don\'t have the permission to view this repo.');
    }
    let repo = await this.projRepoRepository.findOne({where: {full_name: projectName}, fields: ["id"]});
    if(typeof repo === null){
      throw new HttpErrors.InternalServerError('The repository data is missing.');
    }
    let closedIssues = await this.issueRepository.find({where: {repos_id: repo?.id, state: "closed"}, fields: ["updated_at"]});
    return timeFilter(closedIssues);
  }

  @authenticate('jwt')
  @get('/project/pr')
  @response(200, PROJECT_CIP)
  async projectPR(
      @param.query.string('projectName') projectName: string,
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<{
    name: string,
    value: { name: string, value: number[] }[],
  }[]>{
    console.log('/project/pr');
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
    let closedPRs = await this.pullRepository.find({where: {repos_id: repo?.id, state: "closed"}, fields: ["updated_at"]});
    return timeFilter(closedPRs);
  }

  @authenticate('jwt')
  @get('/project/issuewait')
  @response(200, PROJECT_CIP)
  async projectIssueWait(
      @param.query.string('projectName') projectName: string,
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<{
    name: string,
    value: { name: string, value: number[] }[],
  }[]>{
    console.log('project/issuewait');
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
    let openIssues = await this.issueRepository.find({where: {repos_id: repo?.id, state: "open"}, fields: ["updated_at"]});
    return timeFilter(openIssues);
  }

  @authenticate('jwt')
  @get('/project/prwait')
  @response(200, PROJECT_CIP)
  async projectPRWait(
      @param.query.string('projectName') projectName: string,
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<{
    name: string,
    value: { name: string, value: number[] }[],
  }[]>{
    console.log('/project/prwait');
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
    let openPRs = await this.pullRepository.find({where: {repos_id: repo?.id, state: "open"}, fields: ["updated_at"]});
    return timeFilter(openPRs);
  }

  @authenticate('jwt')
  @get('/project/issuesolve')
  @response(200, IP_SOLVE)
  async issueSolveCount(
      @param.query.string('projectName') projectName: string,
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<number[]>{
    console.log('/project/issuesolve');
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
    let solvedIssues = await this.issueRepository.find({where: {repos_id: repo?.id, state: 'closed'}, fields: ["closed_at"]});
    let result = timeFilterV2(solvedIssues);
    let unsolvedCount = await this.issueRepository.count({repos_id: repo?.id, state: 'open'});
    result[4] = unsolvedCount.count;
    return result;
  }

  @authenticate('jwt')
  @get('/project/prsolve')
  @response(200, IP_SOLVE)
  async prSolveCount(
      @param.query.string('projectName') projectName: string,
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<number[]>{
    console.log('/project/prsolve');
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
    let solvedPR = await this.pullRepository.find({where: {repos_id: repo?.id, state: 'closed'}, fields: ["closed_at"]});
    let result = timeFilterV2(solvedPR);
    let unsolvedCount = await this.pullRepository.count({repos_id: repo?.id, state: 'open'});
    result[4] = unsolvedCount.count;
    return result;
  }

  @authenticate('jwt')
  @get('/project/issue/tag')
  @response(200, ISSUE_TAGS)
  async issueTags(
      @param.query.string('projectName') projectName: string,
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<{name: string, value: number}[]>{
    console.log('/project/issue/tag');
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
    let result: {name: string, value: number}[] = [];
    let allIssues = await this.issueRepository.find({where: {repos_id: repo?.id}, fields: ["labels"]});
    for (const issue of allIssues) {
      for(const label of issue.labels){
        let labelExists = false;
        for (const savedLabel of result) {
          if(savedLabel.name === label.name){
            savedLabel.value++;
            labelExists = true;
            break;
          }
        }
        if(!labelExists){
          result.push({
            name: label.name,
            value: 1,
          });
        }
      }
    }
    return result;
  }

}

function timeFilter(all: {updated_at: string}[]): {
  name: string,
  value: { name: string, value: number[] }[],
}[]{
  let result = [];
  result.push({
    name: '0',
    value: [{
      name: 'We love wzy, wzy is our goddess!',
      value: [50, 0, 0, 0, 0, 0, 0],
    }, {value: [], name: '0'},{value: [], name: '0'}, {value: [], name: '0'}, {value: [], name: '0'}, {value: [], name: '0'}, {value: [], name: '0'}]
  });
  result.push({
    name: '1',
    value: [
      { name: 'Sunday', value: [10, 0, 0, 0] },
      { name: 'Monday', value: [10, 0, 0, 0] },
      { name: 'Tuesday', value: [0, 0, 0, 0] },
      { name: 'Wednesday', value: [10, 0, 0, 0] },
      { name: 'Thursday', value: [0, 0, 0, 0] },
      { name: 'Friday', value: [0, 0, 0, 0] },
      { name: 'Saturday', value: [10, 0, 0, 0] },
    ]
  });
  result.push({
    name: '2',
    value: [
      { name: 'week1', value: [0, 0, 0, 0, 0, 0] },
      { name: 'week2', value: [0, 0, 0, 0, 0, 0] },
      { name: 'week3', value: [0, 0, 0, 0, 0, 0] },
      { name: 'week4', value: [0, 0, 0, 0, 0, 0] },
      {value: [], name: '0'}, {value: [], name: '0'}, {value: [], name: '0'}
    ],
  })
  let today = new Date();
  today.setTime(today.getTime() + 1000 * 60 * 60 * 24);
  today.setHours(0, 0, 0, 0);//set the time limit to 00:00 of the next day
  let weeksAgo:Date[] = [today];
  for(let i = 1; i <= 24; i++){
    weeksAgo.push(new Date(today.getTime() - 7 * i * (1000 * 60 * 60 * 24)));//today is counted in the week)
    weeksAgo[i].setHours(0, 0, 0, 0);
  }

  for(let i = 0; i < all.length; i++){
    let commitTime = new Date(all[i].updated_at);
    for(let j = 24; j > 0; j--){//within 24 weeks
      if(commitTime >= weeksAgo[j] && commitTime < weeksAgo[j - 1]){
        result[2].value[(24 - j) % 4].value[~~((24 - j) / 6)]++;
        //          the number of week    the number of month
        if(j <= 4){//within 4 weeks
          result[1].value[commitTime.getDay()].value[4 - j]++;
          //              the day                  the number of week
          if(j == 1){
            let index = commitTime.getDay() - 1;
            if(index == -1) index = 6; //Sunday
            result[0].value[0].value[index]++;
          }
        }
      }
    }
  }
  return result;
}

function timeFilterV2(all: (Issue & IssueRelations | Pull & PullRelations)[]): number[]{
  let result = [0,20, 0, 0, 0];
  let today = new Date();
  today.setTime(today.getTime() + 1000 * 60 * 60 * 24);
  today.setHours(0, 0, 0, 0);
  let weekAgo = new Date(today.getTime() - 7 * 1000 * 60 * 60 * 24);
  let monthAgo = new Date(today.getTime() - 28 * 1000 * 60 * 60 * 24);//28 days ago
  let halfYearAgo = new Date(today.getTime() - 4 * 7 * 6 * 1000 * 60 * 60 * 24);//6 months, regard 4 weeks as a month
  let yearAgo = new Date(today.getTime() - 365 * 1000 * 60 * 60 * 24);

  for (const contrib of all) {
    let time = new Date(<string>contrib.closed_at);
    if(time >= yearAgo){
      result[3]++;
      if(time >= halfYearAgo){
        result[2]++;
        if(time >= monthAgo){
          result[1]++;
          if(time >= weekAgo){
            result[0]++;
          }
        }
      }
    }
  }
  return result;
}