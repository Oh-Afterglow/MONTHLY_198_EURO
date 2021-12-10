import {Entity, model, property, belongsTo} from '@loopback/repository';
import {ProjRepo} from './proj-repo.model';

@model()
export class Commit extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  sha: string;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  @property({
    type: 'number',
  })
  author_id?: number;

  @property({
    type: 'string',
  })
  author_name?: string;

  @property({
    type: 'string',
  })
  author_email?: string;

  @property({
    type: 'date',
    required: true,
  })
  time: string;

  @property({
    type: 'string',
    required: true,
  })
  message: string;

  @property({
    type: 'string',
    required: true,
  })
  tree_sha: string;

  @property({
    type: 'string',
    required: true,
  })
  tree_content: string;

  @property({
    type: 'array',
    itemType: 'number',
  })
  label_ids?: string[];

  @belongsTo(() => ProjRepo, {name: 'commit_belongs_to_repos'})
  repos_id: number;

  constructor(data?: Partial<Commit>) {
    super(data);
  }
}

export interface CommitRelations {
  // describe navigational properties here
}

export type CommitWithRelations = Commit & CommitRelations;
