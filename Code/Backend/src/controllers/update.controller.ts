import {inject} from '@loopback/core';
import {ProjRepoRepository, UserExtensionRepository, IssueRepository, PullRepository, CommitRepository, LabelRepository} from '../repositories';
import {get, HttpErrors} from "@loopback/rest";
import {authenticate} from "@loopback/authentication";
import {SecurityBindings, UserProfile} from "@loopback/security";
import {repository} from "@loopback/repository";
import {Octokit} from "@octokit/core";

export class UpdateController {
  constructor(
    @repository(UserExtensionRepository)
    protected userExtensionRepository: UserExtensionRepository,
  ) {}

  @authenticate('jwt')
  @get('/update', {
    responses: {
      '200': {
        description: 'The status of updating',
        content: {
          'application/json': {
            schema: {
              type: "boolean",
            }
          }
        }
      }
    }
  })
  async update(
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<boolean>{
    let currentUserEmail = currentUserProfile["email"];
    let permitViewList = await this.userExtensionRepository.findOne({where: {email: currentUserEmail}, fields: ['repo_view_list', 'is_admin']});
    if(typeof permitViewList === null){
      throw new HttpErrors.InternalServerError();
    }
    const octokit = new Octokit();
    for (const project of <string[]>permitViewList?.repo_view_list) {

      const repoResponse = await octokit.request("GET /repos/{owner}/{repo}", {
        owner: project.split('/')[0],
        repo: project.split('/')[1],
      });
      console.log(repoResponse);
    }

    return true;
  }


}
