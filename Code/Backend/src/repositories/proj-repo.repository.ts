import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {ProjRepo, ProjRepoRelations, GithubUser, Issue, Pull} from '../models';
import {GithubUserRepository} from './github-user.repository';
import {IssueRepository} from './issue.repository';
import {PullRepository} from './pull.repository';

export class ProjRepoRepository extends DefaultCrudRepository<
  ProjRepo,
  typeof ProjRepo.prototype.id,
  ProjRepoRelations
> {

  public readonly repos_belongs_to_user: BelongsToAccessor<GithubUser, typeof ProjRepo.prototype.id>;

  public readonly issue_adder: HasManyThroughRepositoryFactory<GithubUser, typeof GithubUser.prototype.id,
          Issue,
          typeof ProjRepo.prototype.id
        >;

  public readonly pr_sender: HasManyThroughRepositoryFactory<GithubUser, typeof GithubUser.prototype.id,
          Pull,
          typeof ProjRepo.prototype.id
        >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('GithubUserRepository') protected githubUserRepositoryGetter: Getter<GithubUserRepository>, @repository.getter('IssueRepository') protected issueRepositoryGetter: Getter<IssueRepository>, @repository.getter('PullRepository') protected pullRepositoryGetter: Getter<PullRepository>,
  ) {
    super(ProjRepo, dataSource);
    this.pr_sender = this.createHasManyThroughRepositoryFactoryFor('pr_sender', githubUserRepositoryGetter, pullRepositoryGetter,);
    this.registerInclusionResolver('pr_sender', this.pr_sender.inclusionResolver);
    this.issue_adder = this.createHasManyThroughRepositoryFactoryFor('issue_adder', githubUserRepositoryGetter, issueRepositoryGetter,);
    this.registerInclusionResolver('issue_adder', this.issue_adder.inclusionResolver);
    this.repos_belongs_to_user = this.createBelongsToAccessorFor('repos_belongs_to_user', githubUserRepositoryGetter,);
    this.registerInclusionResolver('repos_belongs_to_user', this.repos_belongs_to_user.inclusionResolver);
  }
}
