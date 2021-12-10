import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {UserExtension, UserExtensionRelations} from '../models';

export class UserExtensionRepository extends DefaultCrudRepository<
  UserExtension,
  typeof UserExtension.prototype.email,
  UserExtensionRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(UserExtension, dataSource);
  }
}
