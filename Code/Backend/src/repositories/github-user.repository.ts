import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {GithubUser, GithubUserRelations} from '../models';

export class GithubUserRepository extends DefaultCrudRepository<
  GithubUser,
  typeof GithubUser.prototype.id,
  GithubUserRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(GithubUser, dataSource);
  }
}
