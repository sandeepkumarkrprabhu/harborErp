import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from './models/User';
import { PageTitle } from '../shared/page-title/page-title';
import { harborButton } from '../shared/button/button';
import { Table } from '../shared/table/table';
import type { TableAction, TableColumn } from '../shared/Models/Table';
import { Edit3, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, PageTitle, harborButton, Table],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  selectedProject = 'All Projects';
  selectedEnvironment = 'All Environments';
  selectedDate = '';

  projectOptions = ['All Projects', 'harbor-web', 'harbor-api', 'ocean-service', 'river-api'];
  environmentOptions = ['All Environments', 'production', 'staging', 'qa', 'dev'];

  users = signal<User[]>([
    {
      id: 1,
      name: 'Maya Chen',
      email: 'maya.chen@harborerp.com',
      role: 'Product Owner',
      projects: 'harbor-web',
      status: 'Active',
      lastActive: 'Now',
    },
    {
      id: 2,
      name: 'Noah Patel',
      email: 'noah.patel@harborerp.com',
      role: 'Backend Engineer',
      projects: 'harbor-api',
      status: 'Active',
      lastActive: '10 mins ago',
    },
    {
      id: 3,
      name: 'Ayesha Khan',
      email: 'ayesha.khan@harborerp.com',
      role: 'QA Analyst',
      projects: 'ocean-service',
      status: 'Active',
      lastActive: '1 hour ago',
    },
    {
      id: 4,
      name: 'Carlos Silva',
      email: 'carlos.silva@harborerp.com',
      role: 'DevOps Engineer',
      projects: 'river-api',
      status: 'Inactive',
      lastActive: 'Yesterday',
    },
    {
      id: 5,
      name: 'Lina Park',
      email: 'lina.park@harborerp.com',
      role: 'Support Lead',
      projects: 'harbor-web',
      status: 'Active',
      lastActive: '2 hours ago',
    },
  ]);

  get filteredUsers(): User[] {
    // Basic placeholder: returns full list; add filtering later if required
    return this.users();
  }

  columns: TableColumn<User>[] = [
    { key: 'name', label: 'Member', width: '22%', cell: row => row.name, avatar: true },
    { key: 'email', label: 'Email', width: '28%', cell: row => row.email },
    { key: 'role', label: 'Role', width: '12%', cell: row => row.role },
    { key: 'projects', label: 'Projects', width: '16%', cell: row => row.projects },
    { key: 'lastActive', label: 'Last Active', width: '16%', align: 'center', cell: row => row.lastActive },
  ];

  actions: TableAction<User>[] = [
    {
      label: 'Edit',
      icon: Edit3,
      class: 'border-slate-300 text-slate-700 hover:bg-slate-100',
      handler: (row) => this.onEdit(row),
    },
    {
      label: 'Delete',
      icon: Trash2,
      class: 'border-red-300 text-red-700 hover:bg-red-50',
      handler: (row) => this.onRemove(row),
    },
  ];

  onAddNewMember(): void {
    console.log('Add new member');
  }

  onEdit(row: User): void {
    console.log('Edit user', row);
  }

  onRemove(row: User): void {
    console.log('Remove user', row);
  }
}