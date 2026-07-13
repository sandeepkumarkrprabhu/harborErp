import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Team, ValidationErrors } from '../../../Models/Team';
import { UserService } from '../../../core/users/services/userService';
import { User } from '../../../Models/User';

@Component({
  selector: 'app-team-identity',
  imports: [],
  templateUrl: './team-identity.html',
  styleUrl: './team-identity.css',
})
export class TeamIdentity {
  @Input({ required: true }) data!: Team;
  @Input() errors: ValidationErrors = {};
  @Input() showErrors = false;

  teamLeads: User[] = [];

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Fetch users from backend
    this.userService.getUsers().subscribe(users => {
      this.teamLeads = users;

      console.log("Team Data:", this.data);
      // If teamLeadID is already set, ensure it's mapped to the dropdown
      if (this.data.teamLeadID) {
        console.log("selected Team Lead:", this.data.teamLeadID);
        const match = this.teamLeads.find(u => u.id === this.data.teamLeadID);
        if (match) {
          this.data.teamLeadID = match.id; // ensures dropdown shows correct selection
          this.data.teamLeadName = match.name; // optional: keep name in sync
        }
      }

      this.cdr.detectChanges();
    });
  }

  updateField<K extends keyof Team>(field: K, value: Team[K]) {
    this.data[field] = value;
  }

  errorFor(field: keyof Team): string {
    return this.showErrors ? this.errors[field] ?? '' : '';
  }
}
