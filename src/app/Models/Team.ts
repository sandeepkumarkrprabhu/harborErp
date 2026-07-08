import { LucideIconData } from 'lucide-angular';
import { Project } from './project';
import { User } from './User';

export interface Team{
    id: string;
    teamName: string;
    teamDescription: string;
    teamLeadID: string;
    teamLeadName: string;
    totalmembers: number;
    totalProjects: number;
    description: string;
    icon?: LucideIconData;   // correct type for Lucide icons
    projects: Project[];
    teamMembersIDs: [];
    teamMembers: User[]; 
    is_active: boolean;
    created_at: string;
    updated_at: string;

}