import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinInput } from '../components/pin-input/pin-input';
import { PasswordInput } from '../components/app-password-input/app-password-input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, PinInput, PasswordInput],
  templateUrl: './login.html',
})
export class Login {
  mode = signal<'pin' | 'password'>('pin');

  setMode(type: 'pin' | 'password') {
    this.mode.set(type);
  }
}
``