import { Injectable } from '@angular/core';
import { User } from '../../../Models/User';

export interface DeploymentTarget {
  awsRegion: string;
  awsService: string;
  awsResource: string;
}

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
  deploymentTargets?: DeploymentTarget[];
}

export interface APIProject {
  project_name: string;
  project_description: string;
  team: string;
  project_type: string;
  tags: string[] | string;
  members: string[];
  github_org: string;
  github_repo: string;
  branch: string;
  runtime: string;
  environments: {
    environment_name: string;
    branch_name: string;
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
  transformToApiObject(screenObj: ScreenProject, suggestedMembers: User[]): APIProject {
    console.log('Transforming screen object to API object:', screenObj);
    console.log('Suggested members:', suggestedMembers);

    const rawMembers = screenObj.members;
    const normalizedMembers = Array.isArray(rawMembers)
      ? rawMembers
      : rawMembers
        ? [rawMembers]
        : [];

    const memberIds = normalizedMembers
      .map((member) => {
        if (typeof member === 'string') {
          const matchedMember = suggestedMembers.find(
            (suggested) => String(suggested.name) === member,
          );
          console.log(`Matching member ID: ${member} -> Matched:`, matchedMember);
          return matchedMember?.id ? String(matchedMember.id) : member;
        }

        return String(member);
      })
      .filter(Boolean);

    console.log('Normalized member IDs:', memberIds);

    const deploymentTargets =
      Array.isArray(screenObj.deploymentTargets) && screenObj.deploymentTargets.length
        ? screenObj.deploymentTargets
        : [
            {
              awsRegion: screenObj.awsRegion,
              awsService: screenObj.awsService,
              awsResource: screenObj.awsResource || 'default resource',
            },
          ];

    return {
      project_name: screenObj.name,
      project_description: screenObj.description,
      team: screenObj.team,
      project_type: screenObj.type,
      tags: Array.isArray(screenObj.tags)
        ? screenObj.tags
        : (screenObj.tags as string).split(',').map((tag) => tag.trim()),
      members: memberIds,
      github_org: screenObj.repo || '',
      github_repo: screenObj.repo,
      branch: screenObj.branch,
      runtime: screenObj.runtime,
      environments: [
        {
          environment_name: screenObj.environment,
          branch_name: screenObj.branch,
          resources: deploymentTargets.map((target) => ({
            aws_region: target.awsRegion,
            aws_service: target.awsService,
            aws_resource: target.awsResource || 'default resource',
          })),
        },
      ],
    };
  }
}
