import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Commit, CommitRelations, ProjRepo} from '../models';
import {ProjRepoRepository} from './proj-repo.repository';

export class CommitRepository extends DefaultCrudRepository<
  Commit,
  typeof Commit.prototype.sha,
  CommitRelations
> {

  public readonly commit_belongs_to_repos: BelongsToAccessor<ProjRepo, typeof Commit.prototype.sha>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ProjRepoRepository') protected projRepoRepositoryGetter: Getter<ProjRepoRepository>,
  ) {
    super(Commit, dataSource);
    this.commit_belongs_to_repos = this.createBelongsToAccessorFor('commit_belongs_to_repos', projRepoRepositoryGetter,);
    this.registerInclusionResolver('commit_belongs_to_repos', this.commit_belongs_to_repos.inclusionResolver);
  }
}
