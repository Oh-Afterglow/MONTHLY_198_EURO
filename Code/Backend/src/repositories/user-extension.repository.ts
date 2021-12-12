import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {UserExtension, UserExtensionRelations, ProjRepo} from '../models';
import {ProjRepoRepository} from './proj-repo.repository';

export class UserExtensionRepository extends DefaultCrudRepository<
  UserExtension,
  typeof UserExtension.prototype.email,
  UserExtensionRelations
> {

  public readonly viewable_repos: HasManyRepositoryFactory<ProjRepo, typeof UserExtension.prototype.email>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ProjRepoRepository') protected projRepoRepositoryGetter: Getter<ProjRepoRepository>,
  ) {
    super(UserExtension, dataSource);
  }
}
