import { Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Team } from '../../../Models/Team';

@Component({
  selector: 'app-team-roaster-head',
  imports: [LucideAngularModule],
  templateUrl: './team-roaster-head.html',
  styleUrl: './team-roaster-head.css',
})
export class TeamRoasterHead {
    @Input() team!: Team;

}
