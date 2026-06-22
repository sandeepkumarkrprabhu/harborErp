import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../Models/project'; 

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
    if (this.project.healthy > 0 && this.project.unhealthy === 0) return 'bg-green-500';
    if (this.project.healthy > 0 && this.project.unhealthy > 0) return 'bg-yellow-500';
    if (this.project.unhealthy > 0 && this.project.healthy === 0) return 'bg-red-500';
    return 'bg-gray-400';
  }
}
