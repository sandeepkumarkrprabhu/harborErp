import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinInput } from '../components/pin-input/pin-input';
import { PasswordInput } from '../components/app-password-input/app-password-input';
import { LucideAngularModule, Key, Lock } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, PinInput, PasswordInput, LucideAngularModule],
  templateUrl: './login.html',
})
export class Login {
  mode = signal<'pin' | 'password'>('pin');

  // expose icons to the template
  Key = Key;
  Lock = Lock;

  setMode(type: 'pin' | 'password') {
    this.mode.set(type);
  }
}
``