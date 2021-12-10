import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {GithubUser} from './github-user.model';
import {Issue} from './issue.model';
import {Pull} from './pull.model';

@model()
export class ProjRepo extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  proj_name: string;

  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  @property({
    type: 'string',
    required: true,
  })
  full_name: string;

  @property({
    type: 'string',
  })
  description?: string;


  @property({
    type: 'number',
    required: true,
  })
  star_num: number;

  @property({
    type: 'string',
  })
  language?: string;

  @property({
    type: 'object',
  })
  language_stat?: object;

  @property({
    type: 'number',
    required: true,
  })
  open_issues_count: number;

  @property({
    type: 'number',
    required: true,
  })
  forks_count: number;

  @property({
    type: 'number',
    required: true,
  })
  watchers_count: number;

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
    required: true,
  })
  pushed_at: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  topics?: string[];

  @property({
    type: 'string',
    required: true,
  })
  default_branch: string;

  @property({
    type: 'string',
  })
  homepage?: string;

  @property({
    type: 'boolean',
    required: true,
  })
  fork: boolean;

  @belongsTo(() => GithubUser, {name: 'repos_belongs_to_user'})
  owner_id: number;

  @hasMany(() => GithubUser, {through: {model: () => Issue, keyFrom: 'repos_id', keyTo: 'user_id'}})
  issue_adder: GithubUser[];

  @hasMany(() => GithubUser, {through: {model: () => Pull, keyFrom: 'repos_id', keyTo: 'pr_sender_id'}})
  pr_sender: GithubUser[];

  constructor(data?: Partial<ProjRepo>) {
    super(data);
  }
}

export interface ProjRepoRelations {
  // describe navigational properties here
}

export type ProjRepoWithRelations = ProjRepo & ProjRepoRelations;
