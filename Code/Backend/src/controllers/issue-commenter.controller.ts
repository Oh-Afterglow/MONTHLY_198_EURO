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
// Issue,
// CommentsIssue,
GithubUser,
} from '../models';
import {IssueRepository} from '../repositories';
import {authenticate} from "@loopback/authentication";

export class IssueCommenterController {
  constructor(
    @repository(IssueRepository) protected issueRepository: IssueRepository,
  ) { }

  @authenticate('jwt')
  @get('/issues/{id}/commenters', {
    responses: {
      '200': {
        description: 'Array of Issue has many GithubUser through CommentsIssue',
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
    return this.issueRepository.issue_commenter(id).find(filter);
  }

  // @post('/issues/{id}/github-users', {
  //   responses: {
  //     '200': {
  //       description: 'create a GithubUser model instance',
  //       content: {'application/json': {schema: getModelSchemaRef(GithubUser)}},
  //     },
  //   },
  // })
  // async create(
  //   @param.path.number('id') id: typeof Issue.prototype.id,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(GithubUser, {
  //           title: 'NewGithubUserInIssue',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   }) githubUser: Omit<GithubUser, 'id'>,
  // ): Promise<GithubUser> {
  //   return this.issueRepository.issue_commenter(id).create(githubUser);
  // }
  //
  // @patch('/issues/{id}/github-users', {
  //   responses: {
  //     '200': {
  //       description: 'Issue.GithubUser PATCH success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async patch(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(GithubUser, {partial: true}),
  //       },
  //     },
  //   })
  //   githubUser: Partial<GithubUser>,
  //   @param.query.object('where', getWhereSchemaFor(GithubUser)) where?: Where<GithubUser>,
  // ): Promise<Count> {
  //   return this.issueRepository.issue_commenter(id).patch(githubUser, where);
  // }
  //
  // @del('/issues/{id}/github-users', {
  //   responses: {
  //     '200': {
  //       description: 'Issue.GithubUser DELETE success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async delete(
  //   @param.path.number('id') id: number,
  //   @param.query.object('where', getWhereSchemaFor(GithubUser)) where?: Where<GithubUser>,
  // ): Promise<Count> {
  //   return this.issueRepository.issue_commenter(id).delete(where);
  // }
}
