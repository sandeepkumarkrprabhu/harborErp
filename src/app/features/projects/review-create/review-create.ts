import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-review-create',
  standalone: true,
  imports: [],
  templateUrl: './review-create.html',
  styleUrls: ['./review-create.css'],
})
export class ReviewCreate {
  @Input({ required: true }) projectForm!: FormGroup;

  // // Convenience getters for template binding
  // get name(): string {
  //   return this.projectForm.get('name')?.value || '';
  // }

  // get team(): string {
  //   return this.projectForm.get('team')?.value || '';
  // }

  // get type(): string {
  //   return this.projectForm.get('type')?.value || '';
  // }

  // get tags(): string[] {
  //   console.log('project Form (tags):', this.projectForm);
  //   return this.projectForm.get('tags')?.value || [];
  // }

  // get members(): string[] {
  //   return this.projectForm.get('members')?.value || [];
  // }

  // get organization(): string {
  //   return this.projectForm.get('organization')?.value || '';
  // }

  // get repo(): string {
  //   return this.projectForm.get('repo')?.value || '';
  // }

  // get branch(): string {
  //   return this.projectForm.get('branch')?.value || '';
  // }

  // get runtime(): string {
  //   return this.projectForm.get('runtime')?.value || '';
  // }

  // get awsRegion(): string {
  //   return this.projectForm.get('awsRegion')?.value || '';
  // }

  // get environment(): string {
  //   return this.projectForm.get('environment')?.value || '';
  // }

  // get awsServiceList(): string[] {
  //   return this.projectForm.get('awsServiceList')?.value || [];
  // }

  // get awsService(): string {
  //   return this.projectForm.get('awsService')?.value || '';
  // }

  // get serviceTargets(): string {
  //   return this.awsServiceList.length ? this.awsServiceList.join(', ') : this.awsService || 'None';
  // }
}
