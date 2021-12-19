import {Entity, model, property, hasMany} from '@loopback/repository';
import {GithubUser} from './github-user.model';
import {CommentsIssue} from './comments-issue.model';
import {Label} from './label.model';

@model()
export class Issue extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  id: number;

  @property({
    type: 'number',
    required: true,
  })
  number: number;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  state: string;

  @property({
    type: 'boolean',
    required: true,
  })
  is_locked: boolean;

  @property({
    type: 'string',
    required: true,
  })
  body: string;

  @property({
    type: 'date',
    required: true,
  })
  created_at: string;

  @property({
    type: 'date',
    required: true,
  })
  updated_at: string;

  @property({
    type: 'date',
  })
  closed_at?: string;

  @property({
    type: 'number',
    required: true,
  })
  comment_count: number;

  @property({
    type: 'number',
  })
  repos_id?: number;

  @property({
    type: 'number',
  })
  user_id?: number;

  @property({
    type: 'string',
    required: true,
  })
  user_name: string;

  @hasMany(() => GithubUser, {through: {model: () => CommentsIssue, keyFrom: 'issue_id', keyTo: 'commenter_id'}})
  issue_commenter: GithubUser[];

  @hasMany(() => Label)
  labels: Label[];

  constructor(data?: Partial<Issue>) {
    super(data);
  }
}

export interface IssueRelations {
  // describe navigational properties here
}

export type IssueWithRelations = Issue & IssueRelations;
