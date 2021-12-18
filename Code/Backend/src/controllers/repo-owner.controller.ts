import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ProjRepo,
  GithubUser,
} from '../models';
import {ProjRepoRepository} from '../repositories';
import {authenticate} from "@loopback/authentication";

export class RepoOwnerController {
  constructor(
    @repository(ProjRepoRepository)
    public projRepoRepository: ProjRepoRepository,
  ) { }

  @authenticate('jwt')
  @get('/repos/{id}/owner', {
    responses: {
      '200': {
        description: 'GithubUser belonging to ProjRepo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(GithubUser)},
          },
        },
      },
    },
  })
  async getGithubUser(
    @param.path.number('id') id: typeof ProjRepo.prototype.id,
  ): Promise<GithubUser> {
    return this.projRepoRepository.repos_belongs_to_user(id);
  }
}
