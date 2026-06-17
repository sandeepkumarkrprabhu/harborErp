export interface Project {
  id: number;
  name: string;
  description: string;
  environment: string;
  health: number;
  healthy: number;
  unhealthy: number;
  lastDeployment: string;
  owner: string;
  sourceUrl:string;
}