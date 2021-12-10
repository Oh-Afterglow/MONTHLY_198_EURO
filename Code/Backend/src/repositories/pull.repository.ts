import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Pull, PullRelations} from '../models';

export class PullRepository extends DefaultCrudRepository<
  Pull,
  typeof Pull.prototype.id,
  PullRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Pull, dataSource);
  }
}
