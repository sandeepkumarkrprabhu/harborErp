import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  LucideAngularModule,
  Server,
  Smartphone,
  Bug,
  Database,
  UserPlus,
  LayoutGrid,
  UserRound,
  LucideIconData,
} from 'lucide-angular';
import { Observable, map, tap } from 'rxjs';

import { Team } from '../../Models/Team';

import { TeamService } from '../../core/team/team-service';
import { CreateTeam } from './createteam/createteam';

import { TeamCard } from '../../shared/components/team-card/team-card';
import { TeamRoasterHead } from '../../shared/components/team-roaster-head/team-roaster-head';
import { TeamRoasterUser } from '../../shared/components/team-roaster-user/team-roaster-user';
import { TeamOwnedProject } from '../../shared/components/team-owned-project/team-owned-project';

@Component({
  selector: 'app-team',
  imports: [
    LucideAngularModule,
    AsyncPipe,
    TeamCard,
    TeamRoasterHead,
    TeamRoasterUser,
    TeamOwnedProject,
    CreateTeam,
  ],
  templateUrl: './teams.html',
  styleUrl: './teams.css',
})
export class Teams implements OnInit {
  readonly icons: { name: string; icon: LucideIconData }[] = [
    { name: 'server', icon: Server },
    { name: 'smartphone', icon: Smartphone },
    { name: 'bug', icon: Bug },
    { name: 'database', icon: Database },
    { name: 'layout-grid', icon: LayoutGrid },
    { name: 'user-round', icon: UserRound },
  ];

  readonly UserPlus = UserPlus;

  teams$!: Observable<Team[]>;
  selectedTeam: Team | null = null;
  showCreateTeam = false;
  editingTeam: Team | null = null;

  constructor(private teamService: TeamService) {}

  ngOnInit() {
    this.loadTeams();
  }

  private loadTeams() {
    this.teams$ = this.teamService.getTeams().pipe(
      map((data: Team[]) =>
        data.map((team) => {
          const randomIcon = this.getRandomIcon();
          return {
            ...team,
            icon: randomIcon.icon,
            iconName: randomIcon.name,
            projects: team.projects || [],
          };
        }),
      ),
      tap((teams: Team[]) => {
        if (teams.length > 0 && !this.selectedTeam) {
          this.selectedTeam = teams[0];
        }
      }),
    );
  }

  onAddNewTeam() {
    this.editingTeam = null;
    this.showCreateTeam = true;
  }

  onTeamSaved() {
    this.loadTeams();
    this.editingTeam = null;
    this.showCreateTeam = false;
  }

  closeTeamUser() {
    this.editingTeam = null;
    this.showCreateTeam = false;
  }

  getRandomIcon() {
    const randomIndex = Math.floor(Math.random() * this.icons.length);
    return this.icons[randomIndex];
  }

  onTeamSelected(team: Team) {
    this.selectedTeam = team;
  }

  onEditTeam(team: Team) {
    this.selectedTeam = team;
    this.editingTeam = team;
    this.showCreateTeam = true;
  }

  trackById(index: number, team: Team) {
    return team.id;
  }
}
