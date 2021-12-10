import {Entity, model, property} from '@loopback/repository';

@model()
export class CommentsIssue extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  url?: string;

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
    type: 'string',
    required: true,
  })
  body: string;

  @property({
    type: 'number',
  })
  issue_id?: number;

  @property({
    type: 'number',
  })
  commenter_id?: number;

  constructor(data?: Partial<CommentsIssue>) {
    super(data);
  }
}

export interface CommentsIssueRelations {
  // describe navigational properties here
}

export type CommentsIssueWithRelations = CommentsIssue & CommentsIssueRelations;
