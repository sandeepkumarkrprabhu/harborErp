import { Component } from '@angular/core';
import { LucideAngularModule, Save, User, Bell, StickyNote, MessagesSquareIcon, Key } from 'lucide-angular';
import { InputField } from '../../shared/components/input-field/input-field';

@Component({
  selector: 'app-settings',
  imports: [LucideAngularModule, InputField],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {

  readonly Save = Save; 
  readonly User = User;
  readonly Bell = Bell;
  readonly StickyNote = StickyNote;
  readonly MessagesSquareIcon = MessagesSquareIcon;
  readonly Key = Key;
}

