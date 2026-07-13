import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, signal, effect, EventEmitter } from '@angular/core';
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

  getAvatarClass = getAvatarClass;
  getInitials = getInitials;

  constructor() {
    effect(() => {
      const currentUsers = this.users();
      const selected = currentUsers.filter(u => u.selected);
      this.selectedMembers.set(selected);
      this.selectedMembersChange.emit(selected);
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.loadUsers();
    }
  }

  private loadUsers(): void {
    if (this.data && this.data.teamMembers && this.data.teamMembers.length > 0) {
      this.users.set(
        this.data.teamMembers.map(member => ({
          ...member,
          selected: false, // or true if you want to preselect based on teamMembersIDs
        }))
      );
    }
  }

  onUserSelectionChange(user: UserWithSelection): void {
    const updatedUsers = this.users().map(u =>
      u.id === user.id ? { ...u, selected: !u.selected } : u
    );
    this.users.set(updatedUsers);
    console.log('Selected members:', this.selectedMembers());
  }

  getUserInitials(userName: string): string {
    return getInitials(userName);
  }

  getUserAvatarClass(userName: string): string {
    return getAvatarClass(userName);
  }
}
