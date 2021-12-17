import {
  // Count,
  // CountSchema,
  Filter,
  repository,
  // Where,
} from '@loopback/repository';
  import {
  // del,
  get,
  getModelSchemaRef,
  // getWhereSchemaFor,
  param,
  // patch,
  // post,
  // requestBody,
} from '@loopback/rest';
import {
// ProjRepo,
// Pull,
GithubUser,
} from '../models';
import {ProjRepoRepository} from '../repositories';
import {authenticate} from "@loopback/authentication";

export class ReposPrSendersController {
  constructor(
    @repository(ProjRepoRepository) protected projRepoRepository: ProjRepoRepository,
  ) { }

  @authenticate('jwt')
  @get('/repos/{id}/pr-senders', {
    responses: {
      '200': {
        description: 'Array of ProjRepo has many GithubUser through Pull',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(GithubUser)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<GithubUser>,
  ): Promise<GithubUser[]> {
    return this.projRepoRepository.pr_sender(id).find(filter);
  }

//   @post('/proj-repos/{id}/github-users', {
//     responses: {
//       '200': {
//         description: 'create a GithubUser model instance',
//         content: {'application/json': {schema: getModelSchemaRef(GithubUser)}},
//       },
//     },
//   })
//   async create(
//     @param.path.number('id') id: typeof ProjRepo.prototype.id,
//     @requestBody({
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(GithubUser, {
//             title: 'NewGithubUserInProjRepo',
//             exclude: ['id'],
//           }),
//         },
//       },
//     }) githubUser: Omit<GithubUser, 'id'>,
//   ): Promise<GithubUser> {
//     return this.projRepoRepository.pr_sender(id).create(githubUser);
//   }
//
//   @patch('/proj-repos/{id}/github-users', {
//     responses: {
//       '200': {
//         description: 'ProjRepo.GithubUser PATCH success count',
//         content: {'application/json': {schema: CountSchema}},
//       },
//     },
//   })
//   async patch(
//     @param.path.number('id') id: number,
//     @requestBody({
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(GithubUser, {partial: true}),
//         },
//       },
//     })
//     githubUser: Partial<GithubUser>,
//     @param.query.object('where', getWhereSchemaFor(GithubUser)) where?: Where<GithubUser>,
//   ): Promise<Count> {
//     return this.projRepoRepository.pr_sender(id).patch(githubUser, where);
//   }
//
//   @del('/proj-repos/{id}/github-users', {
//     responses: {
//       '200': {
//         description: 'ProjRepo.GithubUser DELETE success count',
//         content: {'application/json': {schema: CountSchema}},
//       },
//     },
//   })
//   async delete(
//     @param.path.number('id') id: number,
//     @param.query.object('where', getWhereSchemaFor(GithubUser)) where?: Where<GithubUser>,
//   ): Promise<Count> {
//     return this.projRepoRepository.pr_sender(id).delete(where);
//   }
 }
