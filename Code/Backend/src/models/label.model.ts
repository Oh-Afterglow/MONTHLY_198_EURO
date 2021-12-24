import {Entity, model, property} from '@loopback/repository';

@model()
export class Label extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  color?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'array',
    itemType: 'number',
    required: true
  })
  issueId: number[];

  constructor(data?: Partial<Label>) {
    super(data);
  }
}

export interface LabelRelations {
  // describe navigational properties here
}

export type LabelWithRelations = Label & LabelRelations;
