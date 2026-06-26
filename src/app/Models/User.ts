import { Project } from "./project";

export interface User {
    memberName: string;
    email: string;
    role: string;
    projects: Project[];
    lastActive: string;
    status: boolean;
}