import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/users/services/userService';
import { User } from '../../../Models/User';

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './team-members.html',
  styleUrls: ['./team-members.css'],
})
export class TeamMembers implements OnInit, OnDestroy {
  @Input({ required: true }) form!: FormGroup;
  @Output() selectedMembersChange = new EventEmitter<User[]>();

  users: User[] = [];
  private selectedIds = new Set<string>();
  private subs = new Subscription();

  /** Reactive search control (no FormsModule/ngModel) */
  searchControl = new FormControl('');

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Ensure the control exists and has an array value
    if (!this.form.get('teamMembers')) {
      this.form.addControl('teamMembers', new FormControl([]));
    } else if (!Array.isArray(this.form.get('teamMembers')?.value)) {
      this.form.get('teamMembers')?.setValue([]);
    }

    // Load users
    const usersSub = this.userService.getUsers().subscribe((users) => {
      this.users = (users || [])
        .filter((user) => user.is_active)
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      this.syncSelectionFromForm();
    });
    this.subs.add(usersSub);

    // Watch for external changes to the teamMembers control
    const control = this.form.get('teamMembers');
    if (control) {
      const ctrlSub = control.valueChanges.subscribe(() => {
        this.syncSelectionFromForm();
      });
      this.subs.add(ctrlSub);
    }

    // Optional: react to search changes if you want to trigger side-effects
    const searchSub = this.searchControl.valueChanges.subscribe(() => {
      // no-op here; filteredUsers() reads searchControl synchronously
    });
    this.subs.add(searchSub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private syncSelectionFromForm(): void {
    const raw = this.form.get('teamMembers')?.value || [];
    this.selectedIds.clear();

    // raw may be array of User objects or array of ids (string/number)
    if (Array.isArray(raw)) {
      for (const item of raw) {
        if (item && typeof item === 'object' && 'id' in item) {
          this.selectedIds.add(String((item as User).id));
        } else {
          this.selectedIds.add(String(item));
        }
      }
    }

    this.enforceLeadMembership();

    // Normalize to User[] if possible (keeps form value consistent)
    const selectedUsers = this.users.filter((u) => this.selectedIds.has(String(u.id)));
    const controlVal = this.form.get('teamMembers')?.value || [];
    const isAlreadyObjects =
      Array.isArray(controlVal) &&
      controlVal.some((v: any) => v && typeof v === 'object' && 'id' in v);

    if (selectedUsers.length > 0 && !isAlreadyObjects) {
      // replace IDs with User[] without emitting valueChanges (avoid loops)
      this.form.get('teamMembers')?.setValue(selectedUsers, { emitEvent: false });
    }

    // Emit current selection to parent
    this.selectedMembersChange.emit(selectedUsers);
  }

  private enforceLeadMembership(): void {
    const leadId = this.getSelectedLeadId();
    if (leadId) {
      this.selectedIds.add(leadId);
    }
  }

  private getSelectedLeadId(): string | null {
    const leadValue = this.form.get('teamLeadID')?.value;
    if (leadValue == null || leadValue === '') {
      return null;
    }

    return String(leadValue);
  }

  /** Return users filtered by searchControl value */
  filteredUsers(): User[] {
    const q = (this.searchControl.value || '').toString().trim().toLowerCase();
    if (!q) return this.users;
    return this.users.filter(
      (u) =>
        (u.name || '').toLowerCase().includes(q) || (u.role_name || '').toLowerCase().includes(q),
    );
  }

  trackById(index: number, item: User) {
    return item.id;
  }

  isSelected(user: User): boolean {
    return this.selectedIds.has(String(user.id));
  }

  isLeadUser(user: User): boolean {
    return this.getSelectedLeadId() === String(user.id);
  }

  toggleMember(user: User) {
    if (this.isLeadUser(user)) {
      return;
    }

    const id = String(user.id);
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }

    // Build selected User[] from loaded users
    const members = this.users.filter((u) => this.selectedIds.has(String(u.id)));

    // Update the form control and mark touched so validation shows
    this.form.get('teamMembers')?.setValue(members);
    this.form.get('teamMembers')?.markAsTouched();

    // Notify parent
    this.selectedMembersChange.emit(members);
  }

  /** Helpers for UI */
  initials(name?: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  avatarColor(id: string | number): string {
    const colors = ['#6EE7B7', '#93C5FD', '#FBCFE8', '#FDE68A', '#FCA5A5', '#C7B3FF'];
    const idx =
      Math.abs(
        String(id)
          .split('')
          .reduce((acc, ch) => acc + ch.charCodeAt(0), 0),
      ) % colors.length;
    return colors[idx];
  }
}
