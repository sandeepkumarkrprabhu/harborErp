import { Component, Input } from '@angular/core';
import type { CreateUserData } from '../create-user/create-user';

@Component({
  selector: 'app-review-create',
  standalone: true,
  templateUrl: './review-create.html',
  styleUrls: ['./review-create.css'],
})
export class ReviewCreate {
  @Input({ required: true }) data!: CreateUserData;

  get projectAssignments(): string {
    return this.data.projects.length ? this.data.projects.join(', ') : 'None';
  }
}
