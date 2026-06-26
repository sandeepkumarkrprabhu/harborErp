import { Component, Input } from '@angular/core';
import { User } from '../../../Models/User';


@Component({
  selector: 'app-team-roaster-user',
  imports: [],
  templateUrl: './team-roaster-user.html',
  styleUrl: './team-roaster-user.css',
})
export class TeamRoasterUser {
  @Input() user!: User;
}
