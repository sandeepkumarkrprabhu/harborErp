import { Component, Input } from '@angular/core';
import type { CreateProjectData } from '../../../Models/project';

@Component({
  selector: 'app-review-create',
  standalone: true,
  imports: [],
  templateUrl: './review-create.html',
  styleUrls: ['./review-create.css'],
})
export class ReviewCreate {
  @Input({ required: true }) data!: CreateProjectData;

  get serviceTargets(): string {
    return this.data.awsServiceList.length
      ? this.data.awsServiceList.join(', ')
      : this.data.awsService;
  }
}
