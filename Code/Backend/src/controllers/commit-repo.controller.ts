import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Commit,
  ProjRepo,
} from '../models';
import {CommitRepository} from '../repositories';

export class CommitRepoController {
  constructor(
    @repository(CommitRepository)
    public commitRepository: CommitRepository,
  ) { }

  @get('/commits/{id}/repo', {
    responses: {
      '200': {
        description: 'ProjRepo belonging to Commit',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProjRepo)},
          },
        },
      },
    },
  })
  async getProjRepo(
    @param.path.string('id') id: typeof Commit.prototype.sha,
  ): Promise<ProjRepo> {
    return this.commitRepository.commit_belongs_to_repos(id);
  }
}
