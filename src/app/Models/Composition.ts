import { environment, recentDeployment } from "./Environments";

export interface ProjectDetail{
    projectName: string;
    projectDescription: string;
    githubdata: string;
    environments: environment[],
    recentDeployments: recentDeployment[]
}