import { Component } from '@angular/core';
import { SortBar } from '../../shared/components/sort-bar/sort-bar';
import { FilterOption } from '../../Models/FilterOption';
import { Eye, Download, SearchIcon } from 'lucide-angular';
import { InputField } from '../../shared/components/input-field/input-field';
import { DataTable } from '../../shared/components/data-table/data-table';
import { TableConfig } from '../../Models/Table';
import { Dropdown } from '../../shared/components/dropdown/dropdown';

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
  searchTerm: string = '';   // ✅ new search term

  // Track selected filters
  selectedEnvironment: string = '';
  selectedProject: string = '';
  selectedDate: string = '';

  // Full deployments list
  deployments = [
    { slNo: 1, project: 'harbor-api', environment: 'Production', status: 'Succees', triggeredBy: 'Alex K.', duration: '2m 15s', timestamp: '2026-06-20T08:45:00', prCommit: 'a1b2c3d', branch: 'main' },
    { slNo: 2, project: 'harbor-frontend', environment: 'Staging', status: 'In Progress', triggeredBy: 'Priya R.', duration: '1m 05s', timestamp: '2026-06-20T09:10:00', prCommit: 'd4e5f6g', branch: 'develop' },
    { slNo: 3, project: 'auth-service', environment: 'Development', status: 'Failed', triggeredBy: 'Sam T.', duration: '3m 40s', timestamp: '2026-06-19T22:30:00', prCommit: 'h7i8j9k', branch: 'feature/auth-refactor' },
    { slNo: 4, project: 'notification-worker', environment: 'Production', status: 'Succees', triggeredBy: 'Zara M.', duration: '2m 00s', timestamp: '2026-06-20T07:55:00', prCommit: 'l0m1n2o', branch: 'main' },
    { slNo: 5, project: 'payment-gateway', environment: 'Production', status: 'Succees', triggeredBy: 'John D.', duration: '4m 20s', timestamp: '2026-06-19T18:15:00', prCommit: 'p9q8r7s', branch: 'release/v2.1' },
    { slNo: 6, project: 'inventory-service', environment: 'QA', status: 'In Progress', triggeredBy: 'Meera L.', duration: '2m 45s', timestamp: '2026-06-20T10:05:00', prCommit: 't1u2v3w', branch: 'feature/stock-alerts' },
    { slNo: 7, project: 'user-profile', environment: 'Development', status: 'Failed', triggeredBy: 'Carlos M.', duration: '5m 10s', timestamp: '2026-06-19T21:00:00', prCommit: 'x4y5z6a', branch: 'feature/avatar-upload' },
    { slNo: 8, project: 'reporting-dashboard', environment: 'Staging', status: 'Succees', triggeredBy: 'Nina P.', duration: '3m 30s', timestamp: '2026-06-20T06:40:00', prCommit: 'b7c8d9e', branch: 'develop' },
    { slNo: 9, project: 'email-service', environment: 'Production', status: 'In Progress', triggeredBy: 'Omar Q.', duration: '2m 50s', timestamp: '2026-06-20T11:20:00', prCommit: 'f1g2h3i', branch: 'main' },
    { slNo: 10, project: 'analytics-engine', environment: 'QA', status: 'Failed', triggeredBy: 'Sophia W.', duration: '6m 00s', timestamp: '2026-06-19T20:10:00', prCommit: 'j7k8l9m', branch: 'feature/data-pipeline' },
    { slNo: 11, project: 'chat-service', environment: 'Production', status: 'Succees', triggeredBy: 'Rajesh B.', duration: '3m 05s', timestamp: '2026-06-20T05:25:00', prCommit: 'n0o1p2q', branch: 'main' },
    { slNo: 12, project: 'file-storage', environment: 'Development', status: 'In Progress', triggeredBy: 'Emily C.', duration: '4m 45s', timestamp: '2026-06-20T09:55:00', prCommit: 'r3s4t5u', branch: 'feature/cloud-sync' }
  ];

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
      list = list.filter(d => d.project === this.selectedProject);
    }

    // Apply date filter (match by date only, ignoring time)
    if (this.selectedDate) {
      const selected = new Date(this.selectedDate).toDateString();
      list = list.filter(d => new Date(d.timestamp).toDateString() === selected);
    }

    // Apply environment filter
    if (this.selectedEnvironment) {
      list = list.filter(d => d.environment === this.selectedEnvironment);
    }

    return list;
  }

  // Table config
  get tableConfig(): TableConfig {
    return {
      columns: [
        { header: '#', field: 'slNo' },
        { header: 'Project', field: 'project', bold: true },
        { header: 'Environment', field: 'environment', badge: true, badgeColorMap: {
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
      console.log('View deployment:', event.row);
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
    return Array.from(new Set(this.deployments.map(d => d.environment)));
  }

  get projects(): string[] {
    return Array.from(new Set(this.deployments.map(d => d.project)));
  }
}
