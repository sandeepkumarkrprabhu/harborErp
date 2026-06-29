import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProjectIdentityData } from './model/ProjectIdentity';

@Component({
  selector: 'app-project-identity',
  standalone: true,
  templateUrl: './project-identity.html',
  styleUrls: ['./project-identity.css']
})
export class ProjectIdentity {
  @Input() data: ProjectIdentityData = {
    name: '',
    team: '',
    type: '',
    description: '',
    tags: [],
    members: []
  };

  @Output() dataChange = new EventEmitter<ProjectIdentityData>();

  updateField(field: keyof ProjectIdentityData, value: any) {
    this.data = { ...this.data, [field]: value };
    this.dataChange.emit(this.data);
  }
}
