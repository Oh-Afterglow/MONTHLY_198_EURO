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
import {ProjRepo} from '../models';
import {ProjRepoRepository, UserExtensionRepository, IssueRepository, PullRepository, CommitRepository} from '../repositories';
import {authenticate} from "@loopback/authentication";
import {inject} from "@loopback/core";
import {SecurityBindings, UserProfile} from "@loopback/security";

// const AUTH_FAILURE_SPEC = {
//   description: 'Permission denied message',
//   content: {
//     'application/json': {
//       schema: {
//         message: {type: 'string'},
//       }
//     }
//   }
// };

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
    protected pullRepository: PullRepository
  ) {}

  @authenticate('jwt')
  @get('/project/compose')
  @response(200, PROJECT_COMPOSE)
  async projectCompose(
      @param.query.string('projectName') projectName: string,
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<{name: string, value: number}[]>{
    let currentUserEmail = currentUserProfile["email"];
    let permitViewList = await this.userExtensionRepository.findOne({where: {email: currentUserEmail}, fields: ['repo_view_list', 'is_admin']});
    if(!permitViewList?.repo_view_list.includes(projectName) && !permitViewList?.is_admin){
      throw new HttpErrors.Forbidden('You don\'t have the permission to view this repo.');
    }
    let repo = await this.projRepoRepository.findOne({where: {full_name: projectName}, fields: ['language_stat']});
    let result = [];
    for(let lang in repo?.language_stat){
      if (repo) {
        result.push({name: lang, value: (repo.language_stat as any)[lang]});
      }
    }
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
    let currentUserEmail = currentUserProfile["email"];
    let permitViewList = await this.userExtensionRepository.findOne({where: {email: currentUserEmail}, fields: ['repo_view_list', 'is_admin']});
    if(!permitViewList?.repo_view_list.includes(projectName) && !permitViewList?.is_admin){
      throw new HttpErrors.Forbidden('You don\'t have the permission to view this repo.');
    }
    let repo = await this.projRepoRepository.findOne({where: {full_name: projectName}, fields: ["id"]});
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
    let currentUserEmail = currentUserProfile["email"];
    let permitViewList = await this.userExtensionRepository.findOne({where: {email: currentUserEmail}, fields: ['repo_view_list', 'is_admin']});
    if(!permitViewList?.repo_view_list.includes(projectName) && !permitViewList?.is_admin){
      throw new HttpErrors.Forbidden('You don\'t have the permission to view this repo.');
    }
    let repo = await this.projRepoRepository.findOne({where: {full_name: projectName}, fields: ["id"]});
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
    let currentUserEmail = currentUserProfile["email"];
    let permitViewList = await this.userExtensionRepository.findOne({where: {email: currentUserEmail}, fields: ['repo_view_list', 'is_admin']});
    if(!permitViewList?.repo_view_list.includes(projectName) && !permitViewList?.is_admin){
      throw new HttpErrors.Forbidden('You don\'t have the permission to view this repo.');
    }
    let repo = await this.projRepoRepository.findOne({where: {full_name: projectName}, fields: ["id"]});
    let allIssues = await this.issueRepository.find({where: {repos_id: repo?.id}, fields: ["updated_at"]});
    return timeFilter(allIssues);
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
    let currentUserEmail = currentUserProfile["email"];
    let permitViewList = await this.userExtensionRepository.findOne({where: {email: currentUserEmail}, fields: ['repo_view_list', 'is_admin']});
    if(!permitViewList?.repo_view_list.includes(projectName) && !permitViewList?.is_admin){
      throw new HttpErrors.Forbidden('You don\'t have the permission to view this repo.');
    }
    let repo = await this.projRepoRepository.findOne({where: {full_name: projectName}, fields: ["id"]});
    let allPRs = await this.pullRepository.find({where: {repos_id: repo?.id}, fields: ["updated_at"]});
    return timeFilter(allPRs);
  }

  // @post('/project')
  // @response(200, {
  //   description: 'ProjRepo model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(ProjRepo)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(ProjRepo, {
  //           title: 'NewProjRepo',
  //
  //         }),
  //       },
  //     },
  //   })
  //   projRepo: ProjRepo,
  // ): Promise<ProjRepo> {
  //   return this.projRepoRepository.create(projRepo);
  // }

  // @get('/project/count')
  // @response(200, {
  //   description: 'ProjRepo model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(
  //   @param.where(ProjRepo) where?: Where<ProjRepo>,
  // ): Promise<Count> {
  //   return this.projRepoRepository.count(where);
  // }
  //
  // @get('/project')
  // @response(200, {
  //   description: 'Array of ProjRepo model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(ProjRepo, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(ProjRepo) filter?: Filter<ProjRepo>,
  // ): Promise<ProjRepo[]> {
  //   return this.projRepoRepository.find(filter);
  // }
  //
  // @patch('/project')
  // @response(200, {
  //   description: 'ProjRepo PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(ProjRepo, {partial: true}),
  //       },
  //     },
  //   })
  //   projRepo: ProjRepo,
  //   @param.where(ProjRepo) where?: Where<ProjRepo>,
  // ): Promise<Count> {
  //   return this.projRepoRepository.updateAll(projRepo, where);
  // }
  //
  // @get('/project/{id}')
  // @response(200, {
  //   description: 'ProjRepo model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(ProjRepo, {includeRelations: true}),
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.number('id') id: number,
  //   @param.filter(ProjRepo, {exclude: 'where'}) filter?: FilterExcludingWhere<ProjRepo>
  // ): Promise<ProjRepo> {
  //   return this.projRepoRepository.findById(id, filter);
  // }
  //
  // @patch('/project/{id}')
  // @response(204, {
  //   description: 'ProjRepo PATCH success',
  // })
  // async updateById(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(ProjRepo, {partial: true}),
  //       },
  //     },
  //   })
  //   projRepo: ProjRepo,
  // ): Promise<void> {
  //   await this.projRepoRepository.updateById(id, projRepo);
  // }
  //
  // @put('/project/{id}')
  // @response(204, {
  //   description: 'ProjRepo PUT success',
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() projRepo: ProjRepo,
  // ): Promise<void> {
  //   await this.projRepoRepository.replaceById(id, projRepo);
  // }
  //
  // @del('/project/{id}')
  // @response(204, {
  //   description: 'ProjRepo DELETE success',
  // })
  // async deleteById(@param.path.number('id') id: number): Promise<void> {
  //   await this.projRepoRepository.deleteById(id);
  // }
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
      value: [0, 0, 0, 0, 0, 0, 0],
    }]
  });
  result.push({
    name: '1',
    value: [
      { name: 'Sunday', value: [0, 0, 0, 0] },
      { name: 'Monday', value: [0, 0, 0, 0] },
      { name: 'Tuesday', value: [0, 0, 0, 0] },
      { name: 'Wednesday', value: [0, 0, 0, 0] },
      { name: 'Thursday', value: [0, 0, 0, 0] },
      { name: 'Friday', value: [0, 0, 0, 0] },
      { name: 'Saturday', value: [0, 0, 0, 0] },
    ]
  });
  result.push({
    name: '2',
    value: [
      { name: 'week1', value: [0, 0, 0, 0, 0, 0] },
      { name: 'week2', value: [0, 0, 0, 0, 0, 0] },
      { name: 'week3', value: [0, 0, 0, 0, 0, 0] },
      { name: 'week4', value: [0, 0, 0, 0, 0, 0] },
    ],
  })
  let today = new Date();
  today.setTime(today.getTime() + 1000 * 60 * 60 * 24);
  today.setHours(0, 0, 0, 0);//set the time limit to 00:00 of the next day
  let weeksAgo:Date[] = [today];
  for(let i = 1; i <= 24; i++){
    weeksAgo.push(new Date(today.getTime() - 7 * i * (1000 * 60 * 60 * 24)));//today is counted in the week)
    weeksAgo[i].setHours(0, 0, 0, 0);
  };

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
