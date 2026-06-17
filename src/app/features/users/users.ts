import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from './models/User';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  users = signal<User[]>([
    {
      id: 1,
      name: 'Admin',
      email: 'admin@temple.com',
      role: 'Admin',
      projects: 'All Modules',
      status: 'Active',
      lastActive: 'Now',
    },
    {
      id: 2,
      name: 'Arun S',
      email: 'arun@temple.com',
      role: 'Engineer',
      projects: 'Temple Admin',
      status: 'Active',
      lastActive: '1 hour ago',
    },
    {
      id: 3,
      name: 'Emma R',
      email: 'emma@temple.com',
      role: 'Engineer',
      projects: 'Fleet, HRM',
      status: 'Active',
      lastActive: '2 hours ago',
    },
  ]);
}