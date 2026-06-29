export interface DeploymentHistory{
    slNo: number;
    projectName: string;
    environmentName: string;
    status: string;
    triggeredBy: string;
    duration: string;
    timestamp: string;
    prCommit: string;
    branch: string;
}