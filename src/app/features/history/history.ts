import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Deployment } from './models/Deployment';
import { PageTitle } from '../shared/page-title/page-title';
import { harborButton } from '../shared/button/button';
import { Search } from '../shared/search/search';
import { Selection } from '../shared/selection/selection';
import { Table } from '../shared/table/table';
import type { TableAction, TableColumn } from '../shared/Models/Table';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, harborButton, PageTitle, Search, Selection, Table],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History {
  
  selectedFilter = 'All';
  selectedProject = 'All Projects';
  selectedEnvironment = 'All Environments';
  selectedDate = '';

  projectOptions = ['All Projects', 'harbor-web', 'harbor-api', 'ocean-service', 'river-api'];
  environmentOptions = ['All Environments', 'production', 'staging', 'qa', 'dev'];
  
  onExport(): void {
    console.log('Export clicked');
  }

  onSearch(): void {
    console.log('Search deployment clicked', {
      project: this.selectedProject,
      environment: this.selectedEnvironment,
      date: this.selectedDate,
      filter: this.selectedFilter,
    });
  }

  // Optional search term (not wired to UI input yet)
  searchTerm = '';

  get filteredDeployments(): Deployment[] {
    const list = this.deployments();
    const filterStatus = this.selectedFilter?.toLowerCase() || 'all';
    const project = this.selectedProject || '';
    const env = this.selectedEnvironment || '';
    const date = this.selectedDate || '';
    const search = this.searchTerm?.toLowerCase() || '';

    return list.filter(d => {
      // status
      if (filterStatus && filterStatus !== 'all') {
        if (d.status.toLowerCase() !== filterStatus) {
          return false;
        }
      }

      // project
      if (project && project !== 'All Projects') {
        if (d.project !== project) return false;
      }

      // environment
      if (env && env !== 'All Environments') {
        if (d.environment !== env) return false;
      }

      // date (compare ISO date part)
      if (date) {
        const dt = new Date(d.timestamp);
        if (isNaN(dt.getTime())) return false;
        const iso = dt.toISOString().slice(0, 10);
        if (iso !== date) return false;
      }

      // search (optional) - check project, user, branch, commit
      if (search) {
        const hay = [d.project, d.user, d.branch, d.commit, d.PRCommit].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(search)) return false;
      }

      return true;
    });
  }

  deployments = signal<Deployment[]>([
    {
      id: 119,
      project: 'harbor-web',
      environment: 'production',
      status: 'running',
      user: 'Sam T.',
      duration: '1m 22s',
      timestamp: 'Jun 24, 2026 1:05 PM',
      commit: 'abc123',
      PRCommit: 'abc123',
      branch: 'feature/login',
    },
    {
      id: 118,
      project: 'harbor-api',
      environment: 'production',
      status: 'success',
      user: 'Alex K.',
      duration: '4m 12s',
      timestamp: 'Jun 24, 2026 12:05 PM',
      commit: 'def456',
      PRCommit: 'def456',
      branch: 'main',
    },
    {
      id: 117,
      project: 'ocean-service',
      environment: 'production',
      status: 'failed',
      user: 'James R.',
      duration: '2m 15s',
      timestamp: 'Jun 24, 2026 11:45 AM',
      commit: 'ghi789',
      PRCommit: 'ghi789',
      branch: 'release/v2',
    },
    {
      id: 116,
      project: 'river-api',
      environment: 'staging',
      status: 'running',
      user: 'Chris L.',
      duration: '58s',
      timestamp: 'Jun 24, 2026 10:55 AM',
      commit: 'jkl321',
      PRCommit: 'jkl321',
      branch: 'feature/payment',
    },
    {
      id: 115,
      project: 'desert-service',
      environment: 'dev',
      status: 'pending',
      user: 'Taylor A.',
      duration: '—',
      timestamp: 'Jun 24, 2026 10:15 AM',
      commit: 'mno654',
      PRCommit: 'mno654',
      branch: 'feature/security',
    },
    {
      id: 114,
      project: 'forest-api',
      environment: 'qa',
      status: 'success',
      user: 'Morgan T.',
      duration: '3m 40s',
      timestamp: 'Jun 24, 2026 09:40 AM',
      commit: 'pqr987',
      PRCommit: 'pqr987',
      branch: 'release/v3',
    },
  ]);

  columns: TableColumn<Deployment>[] = [
    { key: 'id', label: '#', width: '10%', cell: row => row.id },
    { key: 'project', label: 'Project', width: '14%', cell: row => row.project },
    { key: 'environment', label: 'Environment', width: '10%', align: 'center', cell: row => row.environment },
    { key: 'status', label: 'Status', width: '8%', align: 'center', cell: row => row.status },
    { key: 'user', label: 'Triggered By', width: '14%', cell: row => row.user },
    { key: 'PRCommit', label: 'PR/Commit', width: '8%', cell: row => (row.PRCommit || '').substring(0, 7) },
    { key: 'duration', label: 'Duration', width: '6%', align: 'center', cell: row => row.duration },
    { key: 'timestamp', label: 'Timestamp', width: '20%', cell: row => row.timestamp },
    { key: 'branch', label: 'Branch', width: '10%', cell: row => row.branch },
  ];

  actions: TableAction<Deployment>[] = [
    {
      label: 'View',
      class: 'border-slate-300 text-slate-700 hover:bg-slate-100',
      handler: (row) => this.onView(row),
    },
  ];

  onView(row: Deployment): void {
    console.log('View deployment', row);
  }

  onRetry(row: Deployment): void {
    console.log('Retry deployment', row);
  }

  onCancel(row: Deployment): void {
    console.log('Cancel deployment', row);
  }
}