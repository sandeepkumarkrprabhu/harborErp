import { Injectable } from '@angular/core';

export interface ScreenProject {
  name: string;
  team: string;
  type: string;
  description: string;
  tags: string[];
  members: string[];
  organization: string;
  repo: string;
  branch: string;
  runtime: string;
  environment: string;
  awsRegion: string;
  awsService: string;
  awsResource: string;
  awsServiceList: string[];
}

export interface APIProject {
  project_name: string;
  project_description: string;
  team: string;
  project_type: string;
  tags: string[];
  members: string[];
  github_org: string;
  github_repo: string;
  branch: string;
  runtime: string;
  environments: {
    environment_name: string;
    resources: {
      aws_region: string;
      aws_service: string;
      aws_resource: string;
    }[];
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class ProjectHelper {
  transformToApiObject(screenObj: ScreenProject): APIProject {
    return {
      project_name: screenObj.name,
      project_description: screenObj.description,
      team: screenObj.team,
      project_type: screenObj.type,
      tags: screenObj.tags,
      members: screenObj.members,
      github_org: screenObj.organization,
      github_repo: screenObj.repo,
      branch: screenObj.branch,
      runtime: screenObj.runtime,
      environments: [
        {
          environment_name: screenObj.environment,
          resources: [
            {
              aws_region: screenObj.awsRegion,
              aws_service: screenObj.awsService,
              aws_resource: screenObj.awsResource,
            },
          ],
        },
      ],
    };
  }
}
