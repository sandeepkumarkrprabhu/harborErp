import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, signal, effect, EventEmitter } from '@angular/core';
import { UserService } from '../../../core/users/services/userService';
import { User } from '../../../Models/User';
import { Team, ValidationErrors } from '../../../Models/Team';
import { getAvatarClass, getInitials } from '../../utils/string-utils';

interface UserWithSelection extends User {
  selected?: boolean;
}

@Component({
  selector: 'app-team-members',
  imports: [],
  templateUrl: './team-members.html',
  styleUrl: './team-members.css',
})
export class TeamMembers implements OnInit, OnChanges {
  @Input() data!: Team;
  @Input() errors: ValidationErrors = {};
  @Input() showErrors: boolean = false;
  @Output() selectedMembersChange = new EventEmitter<User[]>();

  users = signal<UserWithSelection[]>([]);
  selectedMembers = signal<User[]>([]);
  private searchDebounce: any;

  getAvatarClass = getAvatarClass;
  getInitials = getInitials;

  constructor(private userService: UserService) {
    effect(() => {
      const currentUsers = this.users();
      const selected = currentUsers.filter(u => u.selected);
      this.selectedMembers.set(selected);
      this.selectedMembersChange.emit(selected);
    });
  }

  ngOnInit(): void {
    // Load users only when this component is initialized (i.e. when the user opens step 2)
    this.loadUsers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.loadUsers();
    }
  }

  private loadUsers(): void {
    // If parent passed a prefilled members list, use that as base
    if (this.data && this.data.teamMembers && this.data.teamMembers.length > 0) {
      this.users.set(
        this.data.teamMembers.map(member => ({
          ...member,
          selected: false,
        }))
      );
      return;
    }

    // otherwise fetch from the server (debounced caller may pass a searchTerm)
    this.userService.getUsers().subscribe({
      next: (allUsers) => {
        // limit results to avoid rendering thousands of items; client-side search will filter this set
        const limited = allUsers.slice(0, 200).map(u => ({ ...u, selected: false }));
        this.users.set(limited);
      },
      error: (err) => {
        console.error('Failed to load users', err);
      }
    });
  }

  onUserSelectionChange(user: UserWithSelection): void {
    const updatedUsers = this.users().map(u =>
      u.id === user.id ? { ...u, selected: !u.selected } : u
    );
    this.users.set(updatedUsers);
    console.log('Selected members:', this.selectedMembers());
  }

  onSearchInput(term: string) {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.performSearch(term);
    }, 300);
  }

  private performSearch(term: string) {
    const q = (term || '').trim().toLowerCase();
    if (!q) {
      // reload base limited set
      this.loadUsers();
      return;
    }

    // Fetch full list once and filter client-side (backend may not support search)
    this.userService.getUsers().subscribe({
      next: (allUsers) => {
        const filtered = allUsers.filter(u =>
          (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q)
        ).slice(0, 200).map(u => ({ ...u, selected: false }));
        this.users.set(filtered);
      },
      error: (err) => console.error('User search failed', err)
    });
  }

  getUserInitials(userName: string): string {
    return getInitials(userName);
  }

  getUserAvatarClass(userName: string): string {
    return getAvatarClass(userName);
  }
}
