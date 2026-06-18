export interface Deployment {
  id: number;
  project: string;
  environment: 'production' | 'staging' | 'dev' | 'qa';
  status: 'success' | 'failed' | 'running' | 'pending';
  user: string;
  duration: string;
  timestamp: string;
  commit: string;
  PRCommit:string;
  branch: string;
}
