import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-review.html',
  styleUrls: ['./team-review.css'],
})
export class ReviewTeam {
  @Input({ required: true }) form!: FormGroup;

  ngOnInit() {
    console.log('ReviewTeam form value:', this.form.value);
  }

  get teamLeadName(): string {
    const leadId = this.form.get('teamLeadID')?.value;
    const members = this.form.get('teamMembers')?.value || [];
    const lead = members.find((m: any) => m.id === leadId);
    return lead ? lead.name : leadId; // fallback to ID if not found
  }
}
