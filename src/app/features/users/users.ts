import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { FilterOption } from '../../Models/FilterOption';
import { DataTable } from '../../shared/components/data-table/data-table';
import { TableConfig } from '../../Models/Table';
import { InputField } from '../../shared/components/input-field/input-field';
import { LucideAngularModule, Pencil, Trash, Mail, UserPlus } from 'lucide-angular';
import { CreateUser } from './create-user/create-user';
import { User, getUserStatus } from '../../Models/User';
import { UserService } from '../../core/users/services/userService';

@Component({
  selector: 'app-users',
  imports: [LucideAngularModule, InputField, DataTable, CreateUser],
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

  users: User[] = [];

  constructor(
    private router: Router,
    private readonly userService: UserService,
    private readonly cdr: ChangeDetectorRef
    
  ) {}
  
  ngOnInit(): void {
  
    this.loadUsers();
  
  }
  
  /** Load projects from backend */
  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log('Users loaded:', this.users);
        this.cdr.detectChanges(); // 👈 Force UI refresh
      },
      error: (err) => console.error('Failed to load users', err),
    });
  }

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
  get filteredUsers() {
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
        { header: 'Member Name', field: 'name', bold: true },
        { header: 'Email', field: 'email' },
        { header: 'Role', field: 'role_id' },
        { header: 'Projects', field: 'projects', badge: true }, 
        { header: 'Last Active', field: 'updated_at' },
        { header: 'Status', field: 'status', badge: true, badgeColorMap: {
            'Active': 'bg-green-100 text-green-700',
            'Inactive': 'bg-red-100 text-red-700'
          }}
      ],
      data: this.users.map(user => ({
        ...user,
        status: getUserStatus(user)
      })),
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
    switch (event.action) {
      case 'view':
        console.log('View user:', event.row);
        break;

      case 'edit':
        // Navigate to edit page with row.id
        console.log('edit user:', event.row);
        this.router.navigate(['/users/edit', event.row.id]);
        break;

      case 'delete':
        // Confirm before deleting
        console.log('Delete user:', event.row);
        if (confirm(`Are you sure you want to delete ${event.row.name}?`)) {
          this.userService.deleteUser(event.row.id).subscribe(() => {
            this.loadUsers(); // refresh table after deletion
          });
        }
        break;
    }
  }

}
