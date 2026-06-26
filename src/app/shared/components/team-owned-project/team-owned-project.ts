import { Component, Input } from '@angular/core';
import { Project } from '../../../Models/project';

@Component({
  selector: 'app-team-owned-project',
  imports: [],
  templateUrl: './team-owned-project.html',
  styleUrl: './team-owned-project.css',
})
export class TeamOwnedProject {
  @Input() project!: Project;
}
