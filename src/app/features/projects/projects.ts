import { Component, OnInit, signal, computed, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { SearchIcon } from 'lucide-angular';

import { FilterOption } from '../../Models/FilterOption';
import { Project } from '../../Models/project';
import { SortBar } from '../../shared/components/sort-bar/sort-bar';
import { ProjectCard } from '../../shared/components/project-card/project-card';
import { InputField } from '../../shared/components/input-field/input-field';
import { CreateProject } from './create-project/create-project';
import { ProjectService } from '../../core/projects/services/project.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputField, SortBar, ProjectCard, CreateProject],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css'],
})
export class Projects implements OnInit {
  showCreateProject = false;
  readonly SearchIcon = SearchIcon;

  form!: FormGroup;

  // writable signals
  displayCount = signal(9);
  activeFilter = signal<'all' | 'active' | 'degraded' | 'archived'>('all');
  projects: WritableSignal<Project[]> = signal<Project[]>([]);
  searchTerm = signal('');

  // computed signal for filtered projects
  filteredProjects = computed(() => {
    let list = this.projects();

    // filter by status
    if (this.activeFilter() === 'active') {
      list = list.filter((p) => p.status === 'active');
    } else if (this.activeFilter() === 'degraded') {
      list = list.filter((p) => p.status === 'degraded');
    } else if (this.activeFilter() === 'archived') {
      list = list.filter((p) => p.status === 'archived');
    }

    // search
    const term = this.searchTerm().toLowerCase();
    if (term) {
      list = list.filter(
        (p) =>
          p.project_name?.toLowerCase().includes(term) ||
          p.project_description?.toLowerCase().includes(term),
      );
    }

    return list;
  });

  constructor(
    private readonly projectService: ProjectService,
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({ globalSearch: [''] });

    // initial load
    this.loadProjects();

    // connect form control to signal
    this.form
      .get('globalSearch')!
      .valueChanges.pipe(startWith(''), debounceTime(300), distinctUntilChanged())
      .subscribe((val) => this.searchTerm.set(val ?? ''));
  }

  private loadProjects() {
    this.projectService.getProjects().subscribe((data) => {
      // log the raw data
      console.log('Project details from API:', data);

      // log each project nicely
      data.forEach((p) => {
        console.log(
          `Project: ${p.project_name}, Status: ${p.status}, Repo: ${p.github_org}/${p.github_repo}`,
        );
      });

      // transform and set into signal
      this.projects.set(
        data.map((p) => ({
          ...p,
          source: `${p.github_org}/${p.github_repo}`,
        })),
      );
    });
  }

  getVisibleProjects(projects: Project[]): Project[] {
    return projects.slice(0, this.displayCount());
  }

  hasMoreProjects(projects: Project[]): boolean {
    return projects.length > this.displayCount();
  }

  loadMoreProjects() {
    this.displayCount.update((count) => count + 30);
  }

  openCreateProject() {
    this.showCreateProject = true;
  }

  closeCreateProject() {
    this.showCreateProject = false;
    this.loadProjects(); // refresh projects
  }

  onFilterChange(value: string) {
    this.activeFilter.set(value as any);
  }

  getFilterOptions(projects: Project[]): FilterOption[] {
    return [
      { label: 'All', count: projects.length, value: 'all' },
      {
        label: 'Active',
        count: projects.filter((p) => p.status.toLowerCase() === 'active').length,
        value: 'active',
      },
      {
        label: 'Degraded',
        count: projects.filter((p) => p.unhealthy > 0).length,
        value: 'degraded',
      },
      {
        label: 'Archived',
        count: projects.filter((p) => p.status.toLowerCase() === 'archived').length,
        value: 'archived',
      },
    ];
  }

  trackById(index: number, project: Project) {
    return project.id;
  }
}
