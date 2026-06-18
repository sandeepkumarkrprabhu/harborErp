import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageTitle } from '../../shared/page-title/page-title';
import { harborButton } from '../../shared/button/button';
import { Table } from '../../shared/table/table';
import type { TableAction, TableColumn } from '../../shared/Models/Table';

type User = {
  id: number;
  name: string;
  role: string;
  project: string;
  status: string;
  joined: string;
};

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [CommonModule, FormsModule, PageTitle, harborButton, Table],
  templateUrl: './team-members.html',
  styleUrl: './team-members.css',
})
export class TeamMembers {

  selectedProject = 'All Projects';
  selectedEnvironment = 'All Environments';
  selectedDate = '';

  projectOptions = ['All Projects', 'harbor-web', 'harbor-api', 'ocean-service', 'river-api'];
  environmentOptions = ['All Environments', 'production', 'staging', 'qa', 'dev'];

  users = signal<User[]>([
    { id: 1, name: 'Sam T.', role: 'Developer', project: 'harbor-web', status: 'Active', joined: '2024-08-12' },
    { id: 2, name: 'Alex K.', role: 'DevOps', project: 'harbor-api', status: 'Active', joined: '2023-11-03' },
    { id: 3, name: 'James R.', role: 'QA', project: 'ocean-service', status: 'Active', joined: '2025-02-14' },
    { id: 4, name: 'Chris L.', role: 'Product', project: 'river-api', status: 'Inactive', joined: '2022-05-22' },
    { id: 5, name: 'Taylor A.', role: 'Designer', project: 'harbor-web', status: 'Active', joined: '2021-09-30' },
  ]);

  get filteredUsers(): User[] {
    // For now, return the full list. Filtering can be added later when inputs exist.
    return this.users();
  }

  columns: TableColumn<User>[] = [
    { key: 'id', label: '#', width: '6%', cell: row => row.id },
    { key: 'name', label: 'Name', width: '28%', cell: row => row.name },
    { key: 'role', label: 'Role', width: '18%', cell: row => row.role },
    { key: 'project', label: 'Project', width: '18%', cell: row => row.project },
    { key: 'joined', label: 'Joined', width: '14%', align: 'center', cell: row => row.joined },
    { key: 'status', label: 'Status', width: '16%', align: 'center', cell: row => row.status },
  ];

  actions: TableAction<User>[] = [
    {
      label: 'Edit',
      class: 'border-slate-300 text-slate-700 hover:bg-slate-100',
      handler: (row) => this.onEdit(row),
    },
    {
      label: 'Remove',
      class: 'border-red-300 text-red-700 hover:bg-red-50',
      handler: (row) => this.onRemove(row),
    },
  ];

  onAddNewMember(): void {
    console.log('Add new member');
  }

  onEdit(row: User): void {
    console.log('Edit member', row);
  }

  onRemove(row: User): void {
    console.log('Remove member', row);
  }
}
