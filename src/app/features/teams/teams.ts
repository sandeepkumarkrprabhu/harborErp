import { Component } from '@angular/core';

import { LucideAngularModule, Server, Smartphone, Bug, Database, LayoutGrid,UserRound } from 'lucide-angular';
import { Team } from '../../Models/Team';
import { TeamCard } from "../../shared/components/team-card/team-card";
import { TeamRoasterHead } from '../../shared/components/team-roaster-head/team-roaster-head';
import { TeamRoasterUser } from '../../shared/components/team-roaster-user/team-roaster-user';
import { getProjectStatus } from '../utils/string-utils';
import { TeamOwnedProject } from "../../shared/components/team-owned-project/team-owned-project";

@Component({
  selector: 'app-team',
  imports: [LucideAngularModule, TeamCard, TeamRoasterHead, TeamRoasterUser, TeamOwnedProject],
  templateUrl: './teams.html',
  styleUrl: './teams.css',
})
export class Teams {
  
  readonly Server = Server;
  readonly LayoutGrid = LayoutGrid;
  readonly UserRound = UserRound;
  readonly Database = Database;
  readonly Bug = Bug;
  readonly Smartphone = Smartphone;

  selectedTeam: Team | null = null;

  ngOnInit(): void {
    // Assuming teams are already populated
    if (this.teams.length > 0) {
      this.selectedTeam = this.teams[0];
    }
  }
  teams: Team[] = [
    {
      teamName: "Backend Titans",
      totalmembers: 4,
      totalProjects: 2,
      description: "Develops APIs, microservices, and database integrations.",
      icon: this.Database,
      projects: [
        {
          id: "1",
          project_name: "ERP API Gateway",
          type: "Backend Service",
          project_description: "Centralized API gateway for ERP modules",
          branch: "main",
          source: "GitHub",
          envs: 4,
          healthy: 4,
          unhealthy: 0,
          status: getProjectStatus(4,0),
          updated_at: "2026-06-26",
          by: "Frank",
          deployments: 18,
          bg: '',
          github_repo: '',
          total_environments:''
        },
        {
          id: "2",
          project_name: "Inventory Service",
          type: "Microservice",
          project_description: "Handles inventory management APIs",
          branch: "develop",
          source: "Azure DevOps",
          envs: 3,
          healthy: 2,
          unhealthy: 1,
          status: getProjectStatus(2,1),
          updated_at: "2026-06-24",
          by: "Grace",
          deployments: 10,
          bg: '',
          github_repo: '',
          total_environments:''
        }
      ],
      teamRoaster: [
        {
          name: "Frank Miller",
          email: "frank@company.com",
          role_name: "Backend Lead",
          projects: [],
          lastActive: "2026-06-26T10:15:00",
          status: 'Active',
          is_active: true,
          github_user_id: '',
          github_username: 'Frank',
          github_verified: true,
          id: "1",
          requires_github_access: true,
          role_id: "1",
          updated_at: "2026-06-26T10:15:00",
          notes:''
        },
        {
          name: "Grace Lee",
          email: "grace@company.com",
          role_name: "Senior Backend Developer",
          projects: [],
          lastActive: "2026-06-25T17:30:00",
          is_active: true,
          status: 'Active',
          github_user_id: '',
          github_username: 'Frank',
          github_verified: true,
          id: "2",
          requires_github_access: true,
          role_id: "1",
          updated_at: "2026-06-26T10:15:00",
          notes:''
        },
        {
          name: "Henry Adams",
          email: "henry@company.com",
          role_name: "API Developer",
          projects: [],
          lastActive: "2026-06-24T15:10:00",
          is_active: true,
          status: 'Active',
          github_user_id: '',
          github_username: 'Frank',
          github_verified: true,
          id: "3",
          requires_github_access: true,
          role_id: "1",
          updated_at: "2026-06-26T10:15:00",
          notes:''
        },
        {
          name: "Ivy Wilson",
          email: "ivy@company.com",
          role_name: "Database Engineer",
          projects: [],
          lastActive: "2026-06-23T09:45:00",
          is_active: false,
          status: 'InActive',
          github_user_id: '',
          github_username: 'Frank',
          github_verified: true,
          id: "4",
          requires_github_access: true,
          role_id: "1",
          updated_at: "2026-06-26T10:15:00",
          notes:''
        }
      ]
    },
    {
      teamName: "QA Champions",
      totalmembers: 3,
      totalProjects: 2,
      description: "Ensures product quality through automated and manual testing.",
      icon: this.Bug,
      projects: [
        {
          id:"2",
          project_name: "Regression Automation",
          type: "Automation",
          project_description: "Automated regression test suite",
          branch: "main",
          source: "GitHub",
          envs: 2,
          healthy: 2,
          unhealthy: 0,
          updated_at: "2026-06-25",
          by: "Jack",
          deployments: 14,
          status: getProjectStatus(2, 0),
          bg: '',
          github_repo: '',
          total_environments:''
        },
        {
          id: "2",
          project_name: "Performance Testing",
          type: "Quality Assurance",
          project_description: "Load and stress testing for ERP APIs",
          branch: "testing",
          source: "Azure DevOps",
          envs: 1,
          healthy: 1,
          unhealthy: 0,
          status: getProjectStatus(1,0),
          updated_at: "2026-06-21",
          by: "Karen",
          deployments: 6,
          bg: '',
          github_repo: '',
          total_environments:''
        }
      ],
      teamRoaster: [
        {
          name: "Jack Turner",
          email: "jack@company.com",
          role_name: "QA Lead",
          projects: [],
          lastActive: "2026-06-26T11:20:00",
          is_active: true,
          status: 'Active',
          github_user_id: '',
          github_username: 'Frank',
          github_verified: true,
          id: "10",
          requires_github_access: true,
          role_id: "1",
          updated_at: "2026-06-26T10:15:00",
          notes:''
        },
        {
          name: "Karen White",
          email: "karen@company.com",
          role_name: "Automation Tester",
          projects: [],
          lastActive: "2026-06-25T13:40:00",
          is_active: true,
          status: 'Active',
          github_user_id: '',
          github_username: 'Frank',
          github_verified: true,
          id: "11",
          requires_github_access: true,
          role_id: "2",
          updated_at: "2026-06-26T10:15:00",
          notes:''
        },
        {
          name: "Liam Scott",
          email: "liam@company.com",
          role_name: "Manual Tester",
          projects: [],
          lastActive: "2026-06-22T09:10:00",
          is_active: false,
          status: 'InActive',
          github_user_id: '',
          github_username: 'Frank',
          github_verified: true,
          id: "12",
          requires_github_access: true,
          role_id: "3",
          updated_at: "2026-06-26T10:15:00",
          notes:''
        }
      ]
    },
    {
      teamName: "Mobile Mavericks",
      totalmembers: 3,
      totalProjects: 2,
      description: "Builds Android and iOS applications for enterprise solutions.",
      icon: this.Smartphone,
      projects: [
        {
          id: "3",
          project_name: "Fleet Mobile App",
          type: "Mobile App",
          project_description: "Driver management application",
          branch: "release",
          source: "GitHub",
          envs: 2,
          healthy: 2,
          unhealthy: 0,
          updated_at: "2026-06-26",
          by: "Mia",
          deployments: 11,
          status: getProjectStatus(2, 0),
          bg: '',
          github_repo: '',
          total_environments:''
        },
        {
          id: "4",
          project_name: "Temple Admin App",
          type: "Mobile App",
          project_description: "Mobile app for temple administration",
          branch: "main",
          source: "Azure DevOps",
          envs: 3,
          healthy: 3,
          unhealthy: 0,
          updated_at: "2026-06-25",
          by: "Noah",
          deployments: 9,
          status: getProjectStatus(3, 0),
          bg: '',
          github_repo: '',
          total_environments:''
        }
      ],
      teamRoaster: [
        {
          name: "Mia Davis",
          email: "mia@company.com",
          role_name: "Mobile Developer",
          projects: [],
          lastActive: "2026-06-26T15:45:00",
          is_active: true,
          status: 'Active',
          github_user_id: '',
          github_username: 'Frank',
          github_verified: true,
          id: "21",
          requires_github_access: true,
          role_id: "1",
          updated_at: "2026-06-26T10:15:00",
          notes:''
        },
        {
          name: "Noah Clark",
          email: "noah@company.com",
          role_name: "Flutter Developer",
          projects: [],
          lastActive: "2026-06-25T12:30:00",
          is_active: true,
          status: 'Active',
          github_user_id: '',
          github_username: 'Frank',
          github_verified: true,
          id: "22",
          requires_github_access: true,
          role_id: "1",
          updated_at: "2026-06-26T10:15:00",
          notes:''
        },
        {
          name: "Olivia Harris",
          email: "olivia@company.com",
          role_name: "Mobile QA Engineer",
          projects: [],
          lastActive: "2026-06-24T16:15:00",
          is_active: true,
          status: 'Active',
          github_user_id: '',
          github_username: 'Frank',
          github_verified: true,
          id: "23",
          requires_github_access: true,
          role_id: "1",
          updated_at: "2026-06-26T10:15:00",
          notes:''
        }
      ]
    }
  ]

  onTeamSelected(team: Team) {
    this.selectedTeam = team;
  }

}
