import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, KeyRound, LockKeyhole, UserRound } from 'lucide-angular';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { InputField } from '../../../shared/components/input-field/input-field';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ErrorService } from '../../utils/harbor-notify-service';

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
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly errorService = inject(ErrorService);

  loginForm: FormGroup;
  pinForm: FormGroup;
  activeTab: 'password' | 'pin' = 'pin';

  readonly KeyRound = KeyRound;
  readonly LockKeyhole = LockKeyhole;
  readonly UserRound = UserRound;

  // The 6 individual PIN box values — synced into pinForm.pin as a joined string.
  readonly pinDigits = signal<string[]>(['', '', '', '', '', '']);

  readonly isLoading = signal(false);
  //readonly errorMessage = signal<string | null>(null);

  constructor() {
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

  /** Called from the template on each PIN box (input) event. */
  onPinDigitInput(index: number, event: Event, nextInput?: HTMLInputElement, prevInput?: HTMLInputElement) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '').slice(0, 1);
    input.value = value;

    const digits = [...this.pinDigits()];
    digits[index] = value;
    this.pinDigits.set(digits);
    this.pinForm.get('pin')?.setValue(digits.join(''));

    if (value && nextInput) {
      nextInput.focus();
    }
  }

  /** Backspace on an empty box moves focus to the previous box. */
  onPinDigitKeydown(event: KeyboardEvent, index: number, prevInput?: HTMLInputElement) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && prevInput) {
      prevInput.focus();
    }
  }

  onSubmit() {
    if (this.activeTab === 'password') {
      this.submitPassword();
    } else {
      this.submitPin();
    }
  }

  private submitPassword() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        //this.errorMessage.set(err?.error?.message ?? 'Invalid email or password. Please try again.');
        this.errorService.showError(err?.error?.message ?? 'Invalid email or password. Please try again.');
      }
    });
  }

  private submitPin() {
    this.pinForm.markAllAsTouched();
    if (this.pinForm.invalid) {
      return;
    }

    this.isLoading.set(true);

    this.authService.loginWithPin(this.pinForm.getRawValue()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
        this.errorService.showSuccess("user Login validate sucessfully.");
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log("Error:", err?.error?.message ?? "Invalid login");
        //this.errorMessage.set(err?.error?.message ?? 'Invalid email or PIN. Please try again.');
        this.errorService.showError(err?.error?.message ?? 'Invalid email or PIN. Please try again.');
      }
    });
  }
}
