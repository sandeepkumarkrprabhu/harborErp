import { Component } from '@angular/core';
import { LucideAngularModule, Server, Smartphone, Bug, Database, LayoutGrid, UserRound, LucideIconData } from 'lucide-angular';

import { TeamCard } from "../../shared/components/team-card/team-card";
import { TeamRoasterHead } from '../../shared/components/team-roaster-head/team-roaster-head';
import { TeamRoasterUser } from '../../shared/components/team-roaster-user/team-roaster-user';
import { TeamOwnedProject } from "../../shared/components/team-owned-project/team-owned-project";

import { Team } from '../../Models/Team';
import { TeamService } from '../../core/team/team-service';

@Component({
  selector: 'app-team',
  imports: [LucideAngularModule, TeamCard, TeamRoasterHead, TeamRoasterUser, TeamOwnedProject],
  templateUrl: './teams.html',
  styleUrl: './teams.css',
})
export class Teams {
  readonly icons: { name: string; icon: LucideIconData }[] = [
    { name: 'server', icon: Server },
    { name: 'smartphone', icon: Smartphone },
    { name: 'bug', icon: Bug },
    { name: 'database', icon: Database },
    { name: 'layout-grid', icon: LayoutGrid },
    { name: 'user-round', icon: UserRound }
  ];

  teams: Team[] = [];
  selectedTeam: Team | null = null;

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  getRandomIcon() {
    const randomIndex = Math.floor(Math.random() * this.icons.length);
    return this.icons[randomIndex];
  }

  loadTeams() {
    this.teamService.getTeams().subscribe({
      next: (data: Team[]) => {
        console.log("TEams Fetched:", data);
        this.teams = data.map(team => {
          const randomIcon = this.getRandomIcon();
          return {
            ...team,
            icon: randomIcon.icon,   // LucideIconData
            iconName: randomIcon.name, // string for <lucide-icon>
            projects: []
          };
        });
      }
    });
  }

  onTeamSelected(team: Team) {
    this.selectedTeam = team;
  }
}
