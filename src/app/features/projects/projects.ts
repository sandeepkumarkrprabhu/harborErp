import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, map, tap, combineLatest, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AsyncPipe,
    InputField,
    SortBar,
    ProjectCard,
    CreateProject
  ],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css'],
})
export class Projects implements OnInit {
  showCreateProject = false;
  readonly SearchIcon = SearchIcon;

  form!: FormGroup;
  displayCount = 9;
  activeFilter = 'all';

  projects$!: Observable<Project[]>;
  filteredProjects$!: Observable<Project[]>;

  constructor(
    private readonly projectService: ProjectService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // initialize form first
    this.form = this.fb.group({ globalSearch: [''] });

    // projects stream
    this.projects$ = this.projectService.getProjects().pipe(
      tap(apiData => console.log('Raw API Data:', apiData)), // log before mapping
      map((data: Project[]) =>
        data.map(p => ({
          ...p,
          source: `${p.github_org}/${p.github_repo}`
        }))
      )
    );

    // search stream (typed as string)
    const search$: Observable<string> = this.form.get('globalSearch')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    );

    // ✅ combine projects + search
    this.filteredProjects$ = combineLatest([this.projects$, search$]).pipe(
      map(([projects, searchTerm]) => {
        let list = projects;

        // filter by status
        if (this.activeFilter === 'active') {
          list = list.filter(p => p.status === 'active');
        } else if (this.activeFilter === 'degraded') {
          list = list.filter(p => p.status === 'degraded');
        } else if (this.activeFilter === 'archived') {
          list = list.filter(p => p.status === 'archived');
        }

        // search
        const term = (searchTerm ?? '').toString().toLowerCase();
        if (term) {
          list = list.filter(
            p =>
              p.project_name?.toLowerCase().includes(term) ||
              p.project_description?.toLowerCase().includes(term)
          );
        }

        return list;
      })
    );
  }

  getVisibleProjects(projects: Project[]): Project[] {
    return projects.slice(0, this.displayCount);
  }

  hasMoreProjects(projects: Project[]): boolean {
    return projects.length > this.displayCount;
  }

  loadMoreProjects() {
    this.displayCount += 30;
  }

  openCreateProject() {
    this.showCreateProject = true;
  }
  closeCreateProject() {
    this.showCreateProject = false;
  }

  onFilterChange(value: string) {
    this.activeFilter = value;
  }

  getFilterOptions(projects: Project[]): FilterOption[] {
    return [
      { label: 'All', count: projects.length, value: 'all' },
      { label: 'Active', count: projects.filter(p => p.status.toLowerCase() === 'active').length, value: 'active' },
      { label: 'Degraded', count: projects.filter(p => p.unhealthy > 0).length, value: 'degraded' },
      { label: 'Archived', count: projects.filter(p => p.status.toLowerCase() === 'archived').length, value: 'archived' }
    ];
  }

  trackById(index: number, project: Project) {
    return project.id;
  }
}
