import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project } from '../../../Models/project';
import { getProjectStatus } from '../../../features/utils/string-utils';
import { Badge } from '../badge/badge';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, RouterLink, Badge],
  templateUrl: './project-card.html',
  styleUrls: ['./project-card.css'],
})
export class ProjectCard implements OnInit {
  @Input() project!: Project;

  ngOnInit(): void {
    console.log('Project received:', this.project);
  }

  get healthyPercent(): number {
    const total = this.project.healthy + this.project.unhealthy;
    return total > 0 ? (this.project.healthy / total) * 100 : 0;
  }

  get unhealthyPercent(): number {
    const total = this.project.healthy + this.project.unhealthy;
    return total > 0 ? (this.project.unhealthy / total) * 100 : 0;
  }

  get source(): string {
    return this.project.source;
  }

  get statusColor(): string {
    return getProjectStatus(this.project.healthy, this.project.unhealthy, this.project.status);
  }
}
