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
}
