import { environment, recentDeployment } from './Environments';

export interface ProjectDetail {
  id: string;
  projectName: string;
  projectDescription: string;
  github_org: string;
  github_repo: string;
  branch: string;
  environments: environment[];
  recentDeployments: recentDeployment[];
  source: string; // Added source property
  branchName: string; // Added branchName property
}

// project-detail.model.ts

export interface ECS {
  hasECS: boolean;
  status: string;
  runningTasks: string;
  taskDefinition: string;
  dockerImage: string;
}

export interface ALB {
  hasALB: boolean;
  name: string;
  requestCount: string;
  latency: string;
  errorRate5xx: string;
}

export interface RDS {
  hasRDS: boolean;
  connections: string;
  cpuUtilization: string;
  storageGB: string;
}

export interface S3 {
  hasS3: boolean;
  totalObjects: string;
  storageTotal: string;
  lastModified: string;
}

export interface SQS {
  hasSQS: boolean;
  visibleMsgs: string;
  inFlightMsgs: string;
}

export interface CloudWatchLog {
  timestamp: string;
  level: string;
  message: string;
}

export interface DeploymentSummary {
  prTitle: string;
  prLink: string;
  author: string;
  commitID: string;
  filesChanged: string;
  additions: string;
  deletions: string;
  duration: string;
}

export interface DeploymentHistory {
  timestamp: string;
  deployer: string;
  prTitle: string;
  duration: string;
  outcome: string;
}

export interface PullRequestContext {
  prNumber: string;
  title: string;
  author: string;
  status: string;
  branch: string;
  filesChanged: string;
  additions: string;
  deletions: string;
  linkedIssues: any[];
}

export interface ProjectDetailEnvironment {
  ecs: ECS;
  alb: ALB;
  rds: RDS;
  s3: S3;
  sqs: SQS;
  cloudWatchLogs: CloudWatchLog[];
  deploymentSummary: DeploymentSummary;
  deploymentHistory: DeploymentHistory[];
  pullRequestContext: PullRequestContext;
}

export interface DashboardKPICard {
  deployment_frequency_weekly_average: number;
  deployments_past_24_hours: number;
  deployments_past_hour: number;
  healthy_environments: number;
  total_environments: number;
  unhealthy_environments: number;
}

export interface DashboardRecentActivities {
  author: string;
  description: string;
  project: string;
  timestamp: string;
  title: string;
  type: string;
}

export interface ProjectDeploymentData {
  [key: string]: number;
}

export interface ProjectDeploymentsGraph {
  data: ProjectDeploymentData;
  project_name: string;
}
