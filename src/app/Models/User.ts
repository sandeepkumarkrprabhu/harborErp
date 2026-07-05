import { Project } from "./project";

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    projects: Project[];
    lastActive: string;
    status: string;
    is_active: boolean;
    github_user_id: string;
    github_username: string;
    github_verified: boolean;
    requires_github_access: boolean;
    role_id: string;
    updated_at: string;
}

export function getUserStatus(user: User): string {
    return user.is_active ? "Active" : "Inactive";
}
