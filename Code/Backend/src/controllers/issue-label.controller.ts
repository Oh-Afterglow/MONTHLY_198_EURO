import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Issue,
  Label,
} from '../models';
import {IssueRepository} from '../repositories';

export class IssueLabelController {
  constructor(
    @repository(IssueRepository) protected issueRepository: IssueRepository,
  ) { }

  @get('/issues/{id}/labels', {
    responses: {
      '200': {
        description: 'Array of Issue has many Label',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Label)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Label>,
  ): Promise<Label[]> {
    return this.issueRepository.labels(id).find(filter);
  }

  @post('/issues/{id}/labels', {
    responses: {
      '200': {
        description: 'Issue model instance',
        content: {'application/json': {schema: getModelSchemaRef(Label)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Issue.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Label, {
            title: 'NewLabelInIssue',
            exclude: ['id'],
            optional: ['issueId']
          }),
        },
      },
    }) label: Omit<Label, 'id'>,
  ): Promise<Label> {
    return this.issueRepository.labels(id).create(label);
  }

  @patch('/issues/{id}/labels', {
    responses: {
      '200': {
        description: 'Issue.Label PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Label, {partial: true}),
        },
      },
    })
    label: Partial<Label>,
    @param.query.object('where', getWhereSchemaFor(Label)) where?: Where<Label>,
  ): Promise<Count> {
    return this.issueRepository.labels(id).patch(label, where);
  }

  @del('/issues/{id}/labels', {
    responses: {
      '200': {
        description: 'Issue.Label DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Label)) where?: Where<Label>,
  ): Promise<Count> {
    return this.issueRepository.labels(id).delete(where);
  }
}
