import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Issue, IssueRelations, GithubUser, CommentsIssue, Label} from '../models';
import {CommentsIssueRepository} from './comments-issue.repository';
import {GithubUserRepository} from './github-user.repository';
import {LabelRepository} from './label.repository';

export class IssueRepository extends DefaultCrudRepository<
  Issue,
  typeof Issue.prototype.id,
  IssueRelations
> {

  public readonly issue_commenter: HasManyThroughRepositoryFactory<GithubUser, typeof GithubUser.prototype.id,
          CommentsIssue,
          typeof Issue.prototype.id
        >;

  public readonly labels: HasManyRepositoryFactory<Label, typeof Issue.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('CommentsIssueRepository') protected commentsIssueRepositoryGetter: Getter<CommentsIssueRepository>, @repository.getter('GithubUserRepository') protected githubUserRepositoryGetter: Getter<GithubUserRepository>, @repository.getter('LabelRepository') protected labelRepositoryGetter: Getter<LabelRepository>,
  ) {
    super(Issue, dataSource);
    this.labels = this.createHasManyRepositoryFactoryFor('labels', labelRepositoryGetter,);
    this.registerInclusionResolver('labels', this.labels.inclusionResolver);
    this.issue_commenter = this.createHasManyThroughRepositoryFactoryFor('issue_commenter', githubUserRepositoryGetter, commentsIssueRepositoryGetter,);
    this.registerInclusionResolver('issue_commenter', this.issue_commenter.inclusionResolver);
  }
}
