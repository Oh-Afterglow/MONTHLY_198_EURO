import {Entity, model, property} from '@loopback/repository';

@model()
export class Pull extends Entity {
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
    type: 'number',
    required: true,
  })
  number: number;

  @property({
    type: 'string',
    required: true,
  })
  state: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isLocked: boolean;

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
    type: 'date',
  })
  merged_at?: string;

  @property({
    type: 'number',
  })
  merged_by_user?: number;

  @property({
    type: 'boolean',
    required: true,
  })
  is_merged: boolean;

  @property({
    type: 'number',
  })
  repos_id?: number;

  @property({
    type: 'number',
  })
  pr_sender_id?: number;

  @property({
    type: 'array',
    itemType: 'number',
  })
  label_ids?: string[];

  constructor(data?: Partial<Pull>) {
    super(data);
  }
}

export interface PullRelations {
  // describe navigational properties here
}

export type PullWithRelations = Pull & PullRelations;
