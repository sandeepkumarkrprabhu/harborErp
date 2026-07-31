import { environment, recentDeployment } from './Environments';

export interface ProjectDetail {
  id: string;
  projectName: string;
  projectDescription: string;
  githubdata: string;
  source: string;
  branch: string;
  environments: environment[];
  recentDeployments: recentDeployment[];
}
