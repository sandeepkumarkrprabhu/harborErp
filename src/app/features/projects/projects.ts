import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { SearchIcon } from 'lucide-angular';
import { FilterOption } from '../../Models/FilterOption';
import { Project } from '../../Models/project';
import { SortBar } from '../../shared/components/sort-bar/sort-bar';
import { ProjectCard } from '../../shared/components/project-card/project-card';
import { InputField } from '../../shared/components/input-field/input-field';
import { CreateProject } from './create-project/create-project';
import { ProjectIdentity } from './project-identity/project-identity';
import { ProjectService } from '../../core/projects/services/project.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, InputField, ReactiveFormsModule, SortBar, ProjectCard, CreateProject],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css'],
})

export class Projects {

  showCreateProject = false;
  readonly SearchIcon = SearchIcon;
  activeFilter: string = 'all';
  searchTerm: string = '';
  form !: FormGroup;

  projects: Project[] = [];

  constructor(
    private readonly projectService: ProjectService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      globalSearch: ['']
    });

    this.form.get('globalSearch')!.valueChanges
    .pipe(
      debounceTime(300),          // wait 300ms after typing stops
      distinctUntilChanged()      // only emit if value actually changed
    )
    .subscribe(term => this.onSearchChange(term));

      // Load once immediately
    this.loadProjects();

  }
  
  /** Load projects from backend */
  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.cdr.detectChanges(); // ✅ fixes ExpressionChanged error
      },
      error: (err) => console.error('Failed to load projects', err),
    });
  }

  /** Filtered list based on active filter and search term */
  get filteredProjects(): Project[] {
    let list = this.projects;

    if (this.activeFilter.toLowerCase() === 'active') {
      list = list.filter(p => p.status === 'active');
    } else if (this.activeFilter.toLowerCase() === 'degraded') {
      list = list.filter(p => p.status === 'degraded');
    } else if (this.activeFilter.toLowerCase() === 'archived') {
      list = list.filter(p => p.status === 'archived');
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(p =>
        p.project_name?.toLowerCase().includes(term) ||
        p.project_description?.toLowerCase().includes(term)
      );
    }

    return list;
  }


  /** Handle show create project as popup */
  openCreateProject() {
    this.showCreateProject = true;
  }

  /** Handle hide create project as popup */
  closeCreateProject() {
    this.showCreateProject = false;
  }

  /** Handle filter change from filter-bar */
  onFilterChange(value: string) {
    this.activeFilter = value;
  }

  /** Handle search change from filter-bar */
  onSearchChange(term: string) {
    console.log("Search Term :", term);
    this.searchTerm = term; // receives a string
    this.cdr.detectChanges();
  }

  /** Dynamic filter options with counts */
  get filterOptions(): FilterOption[] {
    return [
      { label: 'All', count: this.projects.length, value: 'all' },
      { label: 'Active', count: this.projects.filter(p => p.status.toLocaleLowerCase() === 'active').length, value: 'active' },
      { label: 'Degraded', count: this.projects.filter(p => p.unhealthy > 0).length, value: 'degraded' },
      { label: 'Archived', count: 0, value: 'archived' }
    ];
  }
}
