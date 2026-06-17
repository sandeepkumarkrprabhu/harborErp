import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../Models/Project';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCard {

  // Controlled from parent layout
  @Input() project!: Project;
}
