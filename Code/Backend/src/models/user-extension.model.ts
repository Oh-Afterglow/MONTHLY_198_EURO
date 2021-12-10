import {Entity, model, property} from '@loopback/repository';

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
    itemType: 'number',
  })
  repo_view_list: number[];

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
