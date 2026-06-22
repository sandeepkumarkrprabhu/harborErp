export interface Project {
  name: string;
  type: string;
  desc: string;
  branch:string;
  source:string;
  envs: number;
  healthy: number;
  unhealthy: number;
  updated: string;
  by: string;
  deployments: number;
}
