import { environment } from "./Environments";

/*Project List Model */
export interface Project {
  id: string;
  project_name: string;
  type: string;
  project_description: string;
  status: string;
  branch:string;
  source:string;
  envs: number;
  healthy: number;
  unhealthy: number;
  updated_at: string;
  by: string;
  deployments: number;
  bg: string;
  github_org: string;
  github_repo: string;
  total_environments: string;
  environments: environment[];
}


export interface CreateProjectData {
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

/* Project Create Model */
export interface NewProject {
  project_name: string;
  project_description: string;
  team: string;
  project_type: string;
  tags: string[];
  members: string[]; // UUIDs
  github_org: string;
  github_repo: string;
  branch: string;
  runtime: string;
  environments: Environment[];
}

export interface Environment {
  environment_name: string;
  resources: AwsResource[];
}

export interface AwsResource {
  aws_region: string;
  aws_service: string;
  aws_resource: string;
}


export type ValidationErrors = Partial<Record<keyof CreateProjectData, string>>;