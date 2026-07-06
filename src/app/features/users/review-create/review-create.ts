import { Component, Input } from '@angular/core';
import { User } from '../../../Models/User';

@Component({
  selector: 'app-review-create',
  standalone: true,
  templateUrl: './review-create.html',
  styleUrls: ['./review-create.css'],
})
export class ReviewCreate {
  @Input({ required: true }) data!: User;

  get projectAssignments(): string {
    return this.data.projects.length ? this.data.projects.join(', ') : 'None';
  }
}
