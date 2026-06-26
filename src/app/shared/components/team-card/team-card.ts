import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Team } from '../../../Models/Team';
import { LucideAngularModule } from 'lucide-angular';
import { getProjectStatus } from '../../../features/utils/string-utils'; 

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './team-card.html',
  styleUrls: ['./team-card.css'],
})
export class TeamCard {
  @Input() team!: Team;
  @Output() selectTeam = new EventEmitter<Team>();

  handleClick() {
    this.selectTeam.emit(this.team);
  }
  
  getProjectStatus(healthy: number, unhealthy: number): string {
    return getProjectStatus(healthy, unhealthy);
  }
}
