import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SortBar } from '../../shared/components/sort-bar/sort-bar';
import { FilterOption } from '../../Models/FilterOption';
import { Eye, Download, SearchIcon } from 'lucide-angular';
import { InputField } from '../../shared/components/input-field/input-field';
import { DataTable } from '../../shared/components/data-table/data-table';
import { TableConfig } from '../../Models/Table';
import { Dropdown } from '../../shared/components/dropdown/dropdown';

import { DeploymentService } from '../../mockdata/dataService/deployment-service';
import { DeploymentHistory } from '../../Models/DeploymentHistory';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [SortBar, InputField, Dropdown, DataTable],
  templateUrl: './history.html',
  styleUrls: ['./history.css'],
})
export class History {

  readonly DownloadIcon = Download;
  readonly SearchIcon = SearchIcon;
  readonly Eye = Eye;
  activeFilter: string = 'all';
  searchTerm: string = '';   // new search term

  deployments: DeploymentHistory[] = [];
  
  constructor(private router: Router, private deploymentService: DeploymentService) { 
    this.deployments = this.deploymentService.getDeployments();
  }
  
  // Track selected filters
  selectedEnvironment: string = '';
  selectedProject: string = '';
  selectedDate: string = '';

  // Filtered + searched deployments
  get filteredDeployments() {
    let list = this.deployments;

    // Apply status filter
    switch (this.activeFilter) {
      case 'success': list = list.filter(d => d.status === 'Succees'); break;
      case 'failed': list = list.filter(d => d.status === 'Failed'); break;
      case 'running': list = list.filter(d => d.status === 'In Progress'); break;
      case 'archived': list = []; break;
    }

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(d =>
        Object.values(d).some(val => String(val).toLowerCase().includes(term))
      );
    }

    // Apply project filter
    if (this.selectedProject) {
      list = list.filter(d => d.projectName === this.selectedProject);
    }

    // Apply date filter (match by date only, ignoring time)
    if (this.selectedDate) {
      const selected = new Date(this.selectedDate).toDateString();
      list = list.filter(d => new Date(d.timestamp).toDateString() === selected);
    }

    // Apply environment filter
    if (this.selectedEnvironment) {
      list = list.filter(d => d.environmentName === this.selectedEnvironment);
    }

    return list;
  }

  // Table config
  get tableConfig(): TableConfig {
    return {
      columns: [
        { header: '#', field: 'slNo' },
        { header: 'Project', field: 'projectName', bold: true },
        { header: 'Environment', field: 'environmentName', badge: true, badgeColorMap: {
            'Production': 'text-[#d08873]',
            'Staging': 'text-black-700',
            'QA': 'text-[#e65100]'
          }},
        { header: 'Status', field: 'status', badge: true, badgeColorMap: {
            'Succees': 'bg-green-100 text-green-700',
            'In Progress': 'bg-yellow-100 text-yellow-700 italic',
            'Failed': 'bg-red-100 text-red-700'
          }},
        { header: 'Triggered By', field: 'triggeredBy', italic: true },
        { header: 'Duration', field: 'duration' },
        { header: 'Timestamp', field: 'timestamp' },
        { header: 'PR/Commit', field: 'prCommit', badge: true },
        { header: 'Branch', field: 'branch', badge: true, italic: true, colorClass: 'text-blue-700' }
      ],
      data: this.filteredDeployments,
      actions: [
        { label: 'View', icon: Eye, color: 'bg-white-100 text-gray-600 border border-black/5 select-none', action: 'view' }
      ]
    };
  }

  /** Dynamic filter options with counts */
  get filterOptions(): FilterOption[] {
    return [
      { label: 'All', count: this.deployments.length, value: 'all' },
      { label: 'Success', count: this.deployments.filter(d => d.status === 'Succeeded').length, value: 'success' },
      { label: 'Failed', count: this.deployments.filter(d => d.status === 'Failed').length, value: 'failed' },
      { label: 'Running', count: this.deployments.filter(d => d.status === 'In Progress').length, value: 'running' },
    ];
  }

  /** Handle filter change */
  onFilterChange(value: string) {
    this.activeFilter = value;
  }

  /** Handle search change */
  onSearchChange(value: string) {
    this.searchTerm = value;
  }

  /** Handle table actions */
  handleTableAction(event: { action: string; row: any }) {
    if (event.action === 'view') {
      console.log("Selecte Row:", event.row);
      const deploymentId = event.row.slNo;
      this.router.navigate(['/deployments', deploymentId]);
    }
  }

  /** Export deployment data to CSV */
  onExportCSV() {
    const rows = this.filteredDeployments;
    if (!rows.length) {
      console.warn('No data to export.');
      return;
    }
    // CSV export logic here...
  }

  onEnvironmentChange(env: string) {
    this.selectedEnvironment = env;
  }

  onProjectChange(project: string) {
    this.selectedProject = project;
  }

  onDateChange(date: string) {
    this.selectedDate = date;
  }

  get environments(): string[] {
    return Array.from(new Set(this.deployments.map(d => d.environmentName)));
  }

  get projects(): string[] {
    return Array.from(new Set(this.deployments.map(d => d.projectName)));
  }
}
