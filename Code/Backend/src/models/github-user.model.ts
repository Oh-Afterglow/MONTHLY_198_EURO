import {Entity, model, property} from '@loopback/repository';

@model()
export class GithubUser extends Entity {
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
    index: {
      unique: true,
    },
  })
  login_name: string;

  @property({
    type: 'string',
    required: true,
  })
  avatar_url: string;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  company?: string;

  @property({
    type: 'string',
  })
  location?: string;

  @property({
    type: 'string',
    required: true
  })
  email: string;

  @property({
    type: 'string',
  })
  bio?: string;

  @property({
    type: 'number',
    required: true,
  })
  followers_count: number;

  @property({
    type: 'number',
    required: true,
  })
  following_count: number;

  @property({
    type: 'date',
  })
  created_at?: string;

  @property({
    type: 'date',
  })
  updated_at?: string;

  @property({
    type: 'number',
    required: true,
  })
  public_repos_count: number;

  @property({
    type: 'boolean',
    required: true,
  })
  isOrg: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  display: boolean;

  @property({
    type: 'string',
  })
  blog?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  org_name?: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  contributesFor?: string[];


  constructor(data?: Partial<GithubUser>) {
    super(data);
  }
}

export interface GithubUserRelations {
  // describe navigational properties here
}

export type GithubUserWithRelations = GithubUser & GithubUserRelations;
