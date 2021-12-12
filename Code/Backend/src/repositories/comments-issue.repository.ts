import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {CommentsIssue, CommentsIssueRelations} from '../models';

export class CommentsIssueRepository extends DefaultCrudRepository<
  CommentsIssue,
  typeof CommentsIssue.prototype.id,
  CommentsIssueRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(CommentsIssue, dataSource);
  }
}
