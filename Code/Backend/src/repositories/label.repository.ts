import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Label, LabelRelations} from '../models';

export class LabelRepository extends DefaultCrudRepository<
  Label,
  typeof Label.prototype.id,
  LabelRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Label, dataSource);
  }
}
