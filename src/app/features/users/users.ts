import { Component } from '@angular/core';

import { FilterOption } from '../../Models/FilterOption';
import { DataTable } from '../../shared/components/data-table/data-table';
import { TableConfig } from '../../Models/Table';
import { InputField } from '../../shared/components/input-field/input-field';
import { LucideAngularModule, Pencil, Trash, Mail, UserPlus } from 'lucide-angular';
import { CreateUser } from './create-user/create-user';

@Component({
  selector: 'app-users',
  imports: [InputField, DataTable, CreateUser, LucideAngularModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {

  readonly Mail = Mail;
  readonly Edit = Pencil;
  readonly Delete = Trash;
  readonly UserPlus = UserPlus;

  showCreateUser = false;
  activeFilter: string = 'all';

  users = [
    {
      memberName: 'Alex K.',
      email: 'alex.k@example.com',
      role: 'Developer',
      projects: ['harbor-api', 'notification-worker'],
      lastActive: '2026-06-20T08:45:00',
      status: 'Active'
    },
    {
      memberName: 'Priya R.',
      email: 'priya.r@example.com',
      role: 'Frontend Engineer',
      projects: ['harbor-frontend', 'reporting-dashboard'],
      lastActive: '2026-06-20T09:10:00',
      status: 'Active'
    },
    {
      memberName: 'Sam T.',
      email: 'sam.t@example.com',
      role: 'Backend Engineer',
      projects: ['auth-service'],
      lastActive: '2026-06-19T22:30:00',
      status: 'Inactive'
    },
    {
      memberName: 'Zara M.',
      email: 'zara.m@example.com',
      role: 'DevOps',
      projects: ['notification-worker'],
      lastActive: '2026-06-20T07:55:00',
      status: 'Active'
    },
    {
      memberName: 'John D.',
      email: 'john.d@example.com',
      role: 'Payments Specialist',
      projects: ['payment-gateway'],
      lastActive: '2026-06-19T18:15:00',
      status: 'Active'
    },
    {
      memberName: 'Meera L.',
      email: 'meera.l@example.com',
      role: 'QA Engineer',
      projects: ['inventory-service'],
      lastActive: '2026-06-20T10:05:00',
      status: 'Active'
    },
    {
      memberName: 'Carlos M.',
      email: 'carlos.m@example.com',
      role: 'UI/UX Designer',
      projects: ['user-profile'],
      lastActive: '2026-06-19T21:00:00',
      status: 'Inactive'
    },
    {
      memberName: 'Nina P.',
      email: 'nina.p@example.com',
      role: 'Frontend Engineer',
      projects: ['reporting-dashboard'],
      lastActive: '2026-06-20T06:40:00',
      status: 'Active'
    },
    {
      memberName: 'Omar Q.',
      email: 'omar.q@example.com',
      role: 'Email Specialist',
      projects: ['email-service'],
      lastActive: '2026-06-20T11:20:00',
      status: 'Active'
    },
    {
      memberName: 'Sophia W.',
      email: 'sophia.w@example.com',
      role: 'Data Analyst',
      projects: ['analytics-engine'],
      lastActive: '2026-06-19T20:10:00',
      status: 'Inactive'
    },
    {
      memberName: 'Rajesh B.',
      email: 'rajesh.b@example.com',
      role: 'Chat Engineer',
      projects: ['chat-service'],
      lastActive: '2026-06-20T05:25:00',
      status: 'Active'
    },
    {
      memberName: 'Emily C.',
      email: 'emily.c@example.com',
      role: 'Cloud Engineer',
      projects: ['file-storage'],
      lastActive: '2026-06-20T09:55:00',
      status: 'Active'
    }
  ];

  /** Dynamic filter options with counts */
  get filterOptions(): FilterOption[] {
    return [
      { label: 'All', count: this.users.length, value: 'all' },
      { label: 'Active', count: this.users.filter(d => d.status === 'Active').length, value: 'active' },
      { label: 'Pending', count: this.users.filter(d => d.status === 'Pending').length, value: 'pending' },
      { label: 'In Active', count: this.users.filter(d => d.status === 'Inactive').length, value: 'inactive' },
    ];
  }

  // Filtered + searched deployments
  get filteredDeployments() {
    let list = this.users;

    // Apply status filter
    switch (this.activeFilter) {
      case 'success': list = list.filter(d => d.status === 'Succees'); break;
      case 'failed': list = list.filter(d => d.status === 'Failed'); break;
      case 'running': list = list.filter(d => d.status === 'In Progress'); break;
      case 'archived': list = []; break;
    }

    return list;
  }

  // Table config
  get usersTableConfig(): TableConfig {
    return {
      columns: [
        { header: 'Member Name', field: 'memberName', bold: true },
        { header: 'Email', field: 'email' },
        { header: 'Role', field: 'role' },
        { header: 'Projects', field: 'projects', badge: true }, 
        { header: 'Last Active', field: 'lastActive' },
        { header: 'Status', field: 'status', badge: true, badgeColorMap: {
            'Active': 'bg-green-100 text-green-700',
            'Inactive': 'bg-red-100 text-red-700'
          }}
      ],
      data: this.users,
      actions: [
        { label: 'Edit', icon: this.Edit, color: 'bg-white-100 text-white-700 border border-black/5', action: 'edit' },
        { label: 'Delete', icon: this.Delete, color: 'bg-red-100 text-red-700 border border-black/5', action: 'delete' }
      ]
    };
  }

  //Send Invite to new email user
  onAddNewMember() {
    this.showCreateUser = true;
  }

  closeCreateUser() {
    this.showCreateUser = false;
  }

  onSendInvite() {
    console.log("Send Invite");
  }

  /** Handle filter change */
  onFilterChange(value: string) {
    this.activeFilter = value;
  }

  /** Handle table actions */
  handleTableAction(event: { action: string; row: any }) {
    if (event.action === 'view') {
      console.log('View deployment:', event.row);
    }
  }
}
