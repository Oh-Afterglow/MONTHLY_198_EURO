import {Entity, model, property, hasMany} from '@loopback/repository';
import {ProjRepo} from './proj-repo.model';

@model()
export class UserExtension extends Entity {
  @property({
    type: 'string',
    requires: true,
    id: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  github_username: string;

  @property({
    type: 'object',
  })
  avatar?: object;

  @property({
    type: 'array',
    itemType: 'string',
  })
  repo_view_list: string[];

  @property({
    type: 'boolean',
    default: false,
  })
  is_admin?: boolean;


  constructor(data?: Partial<UserExtension>) {
    super(data);
  }
}

export interface UserExtensionRelations {
  // describe navigational properties here
}

export type UserExtensionWithRelations = UserExtension & UserExtensionRelations;
