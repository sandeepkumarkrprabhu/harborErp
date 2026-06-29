import { Component, Input } from '@angular/core';
import type { CreateProjectData, ValidationErrors } from '../create-project/create-project';

@Component({
  selector: 'app-project-identity',
  standalone: true,
  templateUrl: './project-identity.html',
  styleUrls: ['./project-identity.css']
})
export class ProjectIdentity {
  @Input({ required: true }) data!: CreateProjectData;
  @Input() errors: ValidationErrors = {};
  @Input() showErrors = false;

  suggestedMembers = [
    { name: 'Luna Valen', handle: '@lunaVortex', initials: 'LV', bg: 'bg-primary' },
    { name: 'Ravi Aven', handle: '@raviQuantum', initials: 'RA', bg: 'bg-primary/80' },
    { name: 'Isla Jansen', handle: '@islaNova', initials: 'IJ', bg: 'bg-primary/60' },
    { name: 'Kiran Dey', handle: '@kiranChronos', initials: 'KD', bg: 'bg-primary/40' },
    { name: 'Mira Elwood', handle: '@miraCelestia', initials: 'ME', bg: 'bg-primary/20' },
    { name: 'Tariq Bloom', handle: '@tariqBloom', initials: 'TB', bg: 'bg-primary/70' }
  ];

  updateField<K extends keyof CreateProjectData>(field: K, value: CreateProjectData[K]) {
    this.data[field] = value;
  }

  toggleMember(memberName: string) {
    const idx = this.data.members.indexOf(memberName);
    if (idx > -1) {
      // remove if already selected
      this.data.members.splice(idx, 1);
    } else {
      // add if not present
      this.data.members.push(memberName);
    }
  }

  parseCsv(value: string): string[] {
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }

  errorFor(field: keyof CreateProjectData): string {
    return this.showErrors ? this.errors[field] ?? '' : '';
  }
}
