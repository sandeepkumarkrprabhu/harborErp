import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, KeyRound, LockKeyhole, UserRound } from 'lucide-angular';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Button } from '../../../shared/components/button/button';
import { InputField } from '../../../shared/components/input-field/input-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ReactiveFormsModule,
    Button,
    InputField
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  pinForm: FormGroup;
  activeTab: 'password' | 'pin' = 'pin';

  readonly KeyRound = KeyRound;
  readonly LockKeyhole = LockKeyhole;
  readonly UserRound = UserRound;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.pinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pin: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  switchTab(tab: 'password' | 'pin') {
    this.activeTab = tab;
  }

  onSubmit() {
    if (this.activeTab === 'password') {
      this.loginForm.markAllAsTouched();
      if (this.loginForm.valid) {
        console.log('Password login:', this.loginForm.value);
      }
    } else if (this.activeTab === 'pin') {
      this.pinForm.markAllAsTouched();
      if (this.pinForm.valid) {
        console.log('Quick PIN login:', this.pinForm.value);
      }
    }
  }
}