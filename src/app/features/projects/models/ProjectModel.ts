export interface ProjectModel {
  id: number;
  name: string;
  description: string;
  environment: string;
  health: number;
  healthy: number;
  unhealthy: number;
  lastDeployment: string;
  owner: string;
}