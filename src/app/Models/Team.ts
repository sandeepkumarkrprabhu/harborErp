import { LucideIconData } from 'lucide-angular';
import { Project } from './project';
import { User } from './User';

export interface Team{
    teamName: string;
    totalmembers: number;
    totalProjects: number;
    description: string;
    icon?: LucideIconData;   // ✅ correct type for Lucide icons
    projects: Project[];
    teamRoaster: User[]; 
}