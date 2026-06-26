import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../Models/project'; 
import { getProjectStatus } from '../../../features/utils/string-utils';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.html',
  styleUrls: ['./project-card.css'],
})
export class ProjectCard {
  @Input() project!: Project; 

  /** Calculate progress percentage for healthy/unhealthy */
  get healthyPercent(): number {
    const total = this.project.healthy + this.project.unhealthy;
    return total > 0 ? (this.project.healthy / total) * 100 : 0;
  }

  get unhealthyPercent(): number {
    const total = this.project.healthy + this.project.unhealthy;
    return total > 0 ? (this.project.unhealthy / total) * 100 : 0;
  }

  /** Status color for the circle */
  get statusColor(): string {
    return getProjectStatus(this.project.healthy, this.project.unhealthy);
  }
}
