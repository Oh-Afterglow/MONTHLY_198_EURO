import {Entity, model, property} from '@loopback/repository';

@model()
export class Label extends Entity {
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
  name: string;

  @property({
    type: 'number',
  })
  color?: number;

  @property({
    type: 'string',
  })
  description?: string;


  constructor(data?: Partial<Label>) {
    super(data);
  }
}

export interface LabelRelations {
  // describe navigational properties here
}

export type LabelWithRelations = Label & LabelRelations;
