import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where,} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef, HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
  ResponseObject,
} from '@loopback/rest';
import {GithubUser} from '../models';
import {GithubUserRepository, ProjRepoRepository, UserExtensionRepository, CommitRepository} from '../repositories';
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
        let committer = await this.githubUserRepository.findOne({where: {id: allCommits[i].author_id}, fields: ["org_name", "id"]});
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
  @response(200, MEMBER_COMPOSE)
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
