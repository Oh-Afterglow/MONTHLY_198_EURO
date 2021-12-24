// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository} from "@loopback/repository";
import {
  CommitRepository,
  GithubUserRepository,
  IssueRepository, LabelRepository,
  ProjRepoRepository, PullRepository,
  UserExtensionRepository
} from "../repositories";
import {UserRepository} from "@loopback/authentication-jwt";
import {HttpErrors, post, requestBody, response, ResponseObject} from "@loopback/rest";
import {Commit, Issue, Pull} from "../models";

const CUSTOMIZED_DATA: ResponseObject = {
    description: "Data of customized graph",
    content: {
        'application/json': {
            schema: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: {type: "string"},
                        value: {type: "number"},
                    }
                }
            }
        }
    }
}

type response = {
    name: string,
    value: number
}[];

export class CustomController {
  constructor(
      @repository(UserExtensionRepository)
      protected userExtensionRepository: UserExtensionRepository,
      @repository(GithubUserRepository)
      protected githubUserRepository: GithubUserRepository,
      @repository(ProjRepoRepository)
      protected repoRepository: ProjRepoRepository,
      @repository(CommitRepository)
      protected commitRepository: CommitRepository,
      @repository(IssueRepository)
      protected issueRepository: IssueRepository,
      @repository(PullRepository)
      protected pullRepository:PullRepository,
      @repository(LabelRepository)
      protected labelRepository: LabelRepository,
      @repository(UserRepository)
      protected userRepository: UserRepository,
  ) {}

    @post('/custom/customize')
    @response(200, CUSTOMIZED_DATA)
    async customizeData(
        @requestBody({
            content: {
                'application/json':{
                    schema: {
                        type: "object",
                        properties: {
                            project: {type: "string"},
                            chartType: {type: "string"},
                            paramValue: {type: "string"},
                        }
                    }
                }
            }
        } ) body: {chartType: string, paramValue: string, project: string }
    ): Promise<response>{
    let project = await this.repoRepository.findOne({where: {full_name: body.project}, fields: ["id"]});
    if(!project) throw HttpErrors.NotFound;
    let result: response;
    let set, label, person;
    switch (body.chartType) {
      case 'Commit_number_by_organization':
        set = await this.commitRepository.find({where: {repos_id: project.id}, fields: ["author_id", "author_name"]});
        result = await this.countByOrg(set, body.project.split('/')[0]);
        break;
      case 'Commit_number_by_week':
        // @ts-ignore
        set = await this.commitRepository.find({where: {and: [{repos_id: project.id}, {updated_at: {gte: Date.now() - 7 * 24 * 60 * 60 * 1000}}]}, fields: ["author_id", "author_name", "updated_at"]});
        console.log(set.length);
        result = await this.countByTime(set, '', true);
        break;
      case 'Commit_number_by_year':
        // @ts-ignore
        set = await this.commitRepository.find({where: {and: [{repos_id: project.id}, {updated_at: {gte: Date.now() - 365 * 24 * 60 * 60 * 1000}}]}, fields: ["updated_at"]});
        result = await this.countByTime(set, '', false);
        break;
      case 'Issue_number_by_organization':
        set = await this.issueRepository.find({where: {repos_id: project.id}, fields: ["user_id"]});
        result = await this.countByOrg(set, body.project.split('/')[0]);
        break;
      case 'Issue_number_by_week':
        // @ts-ignore
        set = await this.issueRepository.find({where: {and: [{repos_id: project.id}, {created_at: {gte: Date.now() - 7 * 24 * 60 * 60 * 1000}}]}, fields: ["created_at"]});
        result = await this.countByTime(set, 'created', true);
        break;
      case 'Issue_number_by_year':
        // @ts-ignore
        set = await this.issueRepository.find({where: {and: [{repos_id: project.id}, {updated_at: {gte: Date.now() - 365 * 24 * 60 * 60 * 1000}}]}, fields: ["created_at"]});
        result = await this.countByTime(set, 'created', false);
        break;
      case 'Pull_request_number_by_organization':
        set = await this.pullRepository.find({where: {repos_id: project.id}, fields: ["pr_sender_id"]});
        result = await this.countByOrg(set, body.project.split('/')[0]);
        break;
      case 'Pull_request_number_by_week':
        // @ts-ignore
        set = await this.pullRepository.find({where: {and: [{repos_id: project.id}, {created_at: {gte: Date.now() - 7 * 24 * 60 * 60 * 1000}}]}, fields: ["created_at"]})
        result = await this.countByTime(set, 'created', true);
        break;
      case 'Pull_request_number_by_year':
        // @ts-ignore
        set = await this.pullRepository.find({where: {and: [{repos_id: project.id}, {created_at: {gte: Date.now() - 365 * 24 * 60 * 60 * 1000}}]}, fields: ["created_at"]})
        result = await this.countByTime(set, 'created', false);
        break;
      case 'Open_issue_number_by_week':
        // @ts-ignore
        set = await this.issueRepository.find({where: {and: [{repos_id: project.id}, {state: 'open'},{updated_at: {gte: Date.now() - 7 * 24 * 60 * 60 * 1000}}]}, fields: ["created_at"]});
        result = await this.countByTime(set, 'created', true);
        break;
      case 'Open_issue_number_by_year':
        // @ts-ignore
        set = await this.issueRepository.find({where: {and: [{repos_id: project.id}, {state: 'open'},{updated_at: {gte: Date.now() - 365 * 24 * 60 * 60 * 1000}}]}, fields: ["created_at"]});
        result = await this.countByTime(set, 'created', false);
        break;
      case 'Closed_issue_number_by_week':
        // @ts-ignore
        set = await this.issueRepository.find({where: {and: [{repos_id: project.id}, {state: 'closed'},{closed_at: {gte: Date.now() - 7 * 24 * 60 * 60 * 1000}}]}, fields: ["closed_at"]});
        result = await this.countByTime(set, 'closed', true);
        break;
      case 'Closed_issue_number_by_year':
        // @ts-ignore
        set = await this.issueRepository.find({where: {and: [{repos_id: project.id}, {state: 'closed'},{closed_at: {gte: Date.now() - 365 * 24 * 60 * 60 * 1000}}]}, fields: ["closed_at"]});
        result = await this.countByTime(set, 'closed', false);
        break;
      case 'Open_pull_request_number_by_week':
        // @ts-ignore
        set = await this.pullRepository.find({where: {and: [{repos_id: project.id}, {state: 'open'},{created_at: {gte: Date.now() - 7 * 24 * 60 * 60 * 1000}}]}, fields: ["created_at"]});
        result = await this.countByTime(set, 'created', true);
        break;
      case 'Open_pull_request_number_by_year':
        // @ts-ignore
        set = await this.pullRepository.find({where: {and: [{repos_id: project.id}, {state: 'open'},{created_at: {gte: Date.now() - 365 * 24 * 60 * 60 * 1000}}]}, fields: ["created_at"]});
        result = await this.countByTime(set, 'created', false);
        break;
      case 'Closed_pull_request_number_by_week':
        // @ts-ignore
        set = await this.pullRepository.find({where: {and: [{repos_id: project.id}, {state: 'closed'},{closed_at: {gte: Date.now() - 7 * 24 * 60 * 60 * 1000}}]}, fields: ["closed_at"]});
        result = await this.countByTime(set, 'closed', true);
        break;
      case 'Closed_pull_request_number_by_year':
        // @ts-ignore
        set = await this.pullRepository.find({where: {and: [{repos_id: project.id}, {state: 'closed'},{closed_at: {gte: Date.now() - 365 * 24 * 60 * 60 * 1000}}]}, fields: ["closed_at"]});
        result = await this.countByTime(set, 'closed', false);
        break;
      case 'Tagged_issue_number_by_week':
        label = await this.labelRepository.findOne({where: {name: body.paramValue}, fields: ["issueId"]});
        if(!label) result = [{"name": "Sun", "value": 0,}, {"name": "Mon", "value": 0}, {"name": "Tue", "value": 0,}, {"name": "Wed", "value": 0,}, {"name": "Thu", "value": 0,}, {"name": "Fri", "value": 0}, {"name": "Sat", "value": 0,}];
        else {
          set = await this.issueRepository.find({ // @ts-ignore
            where: {and: [{repos_id: project.id}, {id: {inq: label.issueId}}, {created_at: {gte: Date.now() - 7 * 24 * 60 * 60 * 1000}}]},
            fields: ["created_at"]
          });
          result = await this.countByTime(set, 'created', true);
        }
        break;
      case 'Tagged_issue_number_by_year':
        label = await this.labelRepository.findOne({where: {name: body.paramValue}, fields: ["issueId"]});
        if(!label) result = [{"name": "Jan", "value": 0,}, {"name": "Feb", "value": 0,}, {"name": "Mar", "value": 0,}, {"name": "Apr", "value": 0,}, {"name": "May", "value": 0,}, {"name": "June", "value": 0,}, {"name": "Jul", "value": 0,}, {"name": "Aug", "value": 0,}, {"name": "Sept", "value": 0,}, {"name": "Oct", "value": 0,}, {"name": "Nov", "value": 0,},{"name": "Dec", "value": 0,}];
        else {
          set = await this.issueRepository.find({ // @ts-ignore
            where: {and: [{repos_id: project.id}, {id: {inq: label.issueId}}, {created_at: {gte: Date.now() - 365 * 24 * 60 * 60 * 1000}}]},
            fields: ["created_at"]
          });
          result = await this.countByTime(set, 'created', false);
        }
        break;
      case 'Personal_contribution_number_by_week':
        person = await this.githubUserRepository.findOne({where: {login_name: body.paramValue}, fields: ["id"]});
        if(!person) result = [{"name": "Sun", "value": 0,}, {"name": "Mon", "value": 0}, {"name": "Tue", "value": 0,}, {"name": "Wed", "value": 0,}, {"name": "Thu", "value": 0,}, {"name": "Fri", "value": 0}, {"name": "Sat", "value": 0,}];
        else {
          set = await this.commitRepository.find({          // @ts-ignore
            where: {and: [{repos_id: project.id}, {author_id: person.id}, {updated_at: {gte: Date.now() - 7 * 24 * 60 * 60 * 1000}}]},
            fields: ["updated_at"]
          });
          result = await this.countByTime(set, '', true);
        }
        break;
      case 'Personal_contribution_number_by_year':
        person = await this.githubUserRepository.findOne({where: {login_name: body.paramValue}, fields: ["id"]});
        if(!person) result = [{"name": "Jan", "value": 0,}, {"name": "Feb", "value": 0,}, {"name": "Mar", "value": 0,}, {"name": "Apr", "value": 0,}, {"name": "May", "value": 0,}, {"name": "June", "value": 0,}, {"name": "Jul", "value": 0,}, {"name": "Aug", "value": 0,}, {"name": "Sept", "value": 0,}, {"name": "Oct", "value": 0,}, {"name": "Nov", "value": 0,},{"name": "Dec", "value": 0,}];
        else {
          set = await this.commitRepository.find({          // @ts-ignore
            where: {and: [{repos_id: project.id}, {author_id: person.id}, {updated_at: {gte: Date.now() - 365 * 24 * 60 * 60 * 1000}}]},
            fields: ["updated_at"]
          });
          result = await this.countByTime(set, '', false);
        }
        break;
      default:
        throw HttpErrors.BadRequest;
    }

      return result;
    }

    async countByOrg(set: (Issue | Commit | Pull)[], ownerOrgName: string) : Promise<response>{
      let authorID: number;
      let result: response = [{
        name: 'individual',
        value: 0,
      },{
        name: ownerOrgName,
        value: 0,
      }]
      for (const contrib of set) {
          if(contrib instanceof Issue){
            if(!contrib.user_id) {
              result[1].value ++;
              continue;
            }
            authorID = contrib.user_id;
          } else if(contrib instanceof Commit){
            if(!contrib.author_id) {
              result[1].value++;
              continue;
            }
            authorID = contrib.author_id;
          } else {
            if(!contrib.pr_sender_id){
              result[1].value++;
              continue;
            }
            authorID = contrib.pr_sender_id;
          }
        let person;
        try{
          person = await this.githubUserRepository.findById(authorID, {fields: ["org_name"]});
        } catch (Error) {
            continue;
        }
        if(!person.org_name){
          result[0].value++;
        } else if(person.org_name.includes(ownerOrgName)){
          result[1].value++;
        } else {
          let org: string = person.org_name[0];
          let found: boolean = false;
          for (const orgCount of result) {
            if(orgCount.name == org) {
              orgCount.value++;
              found = true;
              break;
            }
          }
          if(!found){
            result.push({name:org, value: 1});
          }
        }
      }
      let result2: response = [{
        name: 'others',
        value: 0
      }]
      for (const resultElement of result) {
        if(resultElement.value < set.length * 0.05){
          result2[0].value += resultElement.value;
        } else result2.push(resultElement);
      }
      return result;
    }

    async countByTime(set: (Commit | Issue | Pull)[], option: string, isWeek: boolean): Promise<response> {
      let result: response = isWeek? [{"name": "Sun", "value": 0,}, {"name": "Mon", "value": 0}, {"name": "Tue", "value": 0,}, {"name": "Wed", "value": 0,}, {"name": "Thu", "value": 0,}, {"name": "Fri", "value": 0}, {"name": "Sat", "value": 0,}]
        : [{"name": "Jan", "value": 0,}, {"name": "Feb", "value": 0,}, {"name": "Mar", "value": 0,}, {"name": "Apr", "value": 0,}, {"name": "May", "value": 0,}, {"name": "June", "value": 0,}, {"name": "Jul", "value": 0,}, {"name": "Aug", "value": 0,}, {"name": "Sept", "value": 0,}, {"name": "Oct", "value": 0,}, {"name": "Nov", "value": 0,},{"name": "Dec", "value": 0,}];
      for (const contrib of set) {
        let time: string;
        if(contrib instanceof Commit){
          time = contrib.updated_at;
        } else {
          switch (option){
            case "created":
              time = contrib.created_at;
              break;
            case "closed":
              if(!contrib.closed_at) continue;
              time = contrib.closed_at;
              break;
            case "updated": default:
              time = contrib.updated_at;
          }
        }
        console.log(time);
        if(isWeek) result[new Date(time).getDay()].value++;
        else result[new Date(time).getMonth()].value++;
      }
      return result;
    }
}

