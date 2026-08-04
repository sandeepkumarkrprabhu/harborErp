import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/users/services/userService';
import { User } from '../../../Models/User';
import { InputField } from '../../../shared/components/input-field/input-field';

@Component({
  selector: 'app-team-identity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputField],
  templateUrl: './team-identity.html',
  styleUrls: ['./team-identity.css'],
})
export class TeamIdentity implements OnInit {
  @Input({ required: true }) form!: FormGroup;
  teamLeads: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.teamLeads = (users || []).filter((user) => user.is_active);
      this.syncSelectedLead();
    });

    this.form.get('teamLeadID')?.valueChanges.subscribe(() => {
      this.syncSelectedLead();
    });
  }

  private syncSelectedLead(): void {
    const control = this.form.get('teamLeadID');
    const currentValue = control?.value;

    if (!this.teamLeads.length || currentValue == null || currentValue === '') {
      return;
    }

    const normalizedValue = String(currentValue).trim();
    const matchedLead = this.teamLeads.find((lead) => String(lead.id) === normalizedValue);

    if (matchedLead) {
      control?.setValue(String(matchedLead.id), { emitEvent: false });
      return;
    }

    const fallbackLead = this.teamLeads.find(
      (lead) => lead.name?.toLowerCase() === normalizedValue.toLowerCase(),
    );

    if (fallbackLead) {
      control?.setValue(String(fallbackLead.id), { emitEvent: false });
    }
  }

  trackById(index: number, item: User) {
    return item.id;
  }
}
