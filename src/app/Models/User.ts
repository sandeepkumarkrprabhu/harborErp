import { Project } from "./project";

export interface User {
  id: string;
  name: string;
  email: string;
  role_id: string;       
  role_name: string;     
  projects: Project[];
  lastActive: string;    
  is_active: boolean;    
  status: string;
  github_user_id: string;
  github_username: string;
  github_verified: boolean;
  requires_github_access: boolean;
  updated_at: string;    
  notes: string;
}

export function getUserStatus(user: User): string {
  return user.is_active ? "Active" : "Inactive";
}
