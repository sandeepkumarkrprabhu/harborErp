import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LucideAngularModule,
  Save,
  User,
  Bell,
  StickyNote,
  MessagesSquareIcon,
  Key,
} from 'lucide-angular';
import { InputField } from '../../shared/components/input-field/input-field';
import { TokenStorageService } from '../../core/auth/services/token-storage';

@Component({
  selector: 'app-settings',
  imports: [LucideAngularModule, InputField, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  settingsForm!: FormGroup;

  readonly Save = Save;
  readonly User = User;
  readonly Bell = Bell;
  readonly StickyNote = StickyNote;
  readonly MessagesSquareIcon = MessagesSquareIcon;
  readonly Key = Key;

  constructor(
    private fb: FormBuilder,
    private tokenStorage: TokenStorageService,
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
  }

  private loadUserDetails(): void {
    const username = this.tokenStorage.userName();
    const email = this.tokenStorage.userEmail();
    const webhookUrl =
      'https://hooks.slack.com/services/YOUR_WORKSPACE_ID/YOUR_CHANNEL_ID/YOUR_SECRET_TOKEN';

    this.settingsForm = this.fb.group({
      username: [username, Validators.required],
      email: [{ value: email, disabled: true }, Validators.required],
      webhookUrl: [webhookUrl],
    });

    //console.log('Loaded user details:', { username, email });
  }

  saveChanges(): void {
    if (this.settingsForm.valid) {
      console.log('Form submitted:', this.settingsForm.getRawValue());
      // TODO: call API to persist changes
    }
  }
}
