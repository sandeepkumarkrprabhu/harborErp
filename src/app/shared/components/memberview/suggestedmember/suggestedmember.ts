import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../../Models/User';
import { UserHelper } from '../../../../core/users/services/user-helper';

@Component({
  selector: 'app-suggestedmember',
  imports: [],
  templateUrl: './suggestedmember.html',
  styleUrl: './suggestedmember.css',
})
export class Suggestedmember {
  @Input({ required: true }) member!: User;
  @Input() isSelected = false;

  @Output() toggle = new EventEmitter<User>();

  userHelper = UserHelper;

  onToggle() {
    this.toggle.emit(this.member);
  }
}
