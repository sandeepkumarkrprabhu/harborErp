import { Component, inject, signal } from '@angular/core';
import { LucideAngularModule, LockKeyhole } from 'lucide-angular';
import { Button } from '../../../../shared/components/button/button';
import { InputField } from '../../../../shared/components/input-field/input-field';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-setup-password',
  standalone: true,
  imports: [LucideAngularModule, Button, InputField, ReactiveFormsModule],
  templateUrl: './setup-password.html',
  styleUrl: './setup-password.css',
})
export class SetupPassword {
  private readonly fb = inject(FormBuilder);

  setupForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    pin1: ['', [Validators.required, Validators.pattern('[0-9]')]],
    pin2: ['', [Validators.required, Validators.pattern('[0-9]')]],
    pin3: ['', [Validators.required, Validators.pattern('[0-9]')]],
    pin4: ['', [Validators.required, Validators.pattern('[0-9]')]],
    pin5: ['', [Validators.required, Validators.pattern('[0-9]')]],
    pin6: ['', [Validators.required, Validators.pattern('[0-9]')]],
    pin: ['']
  });

  readonly LockKeyhole = LockKeyhole;
  readonly pinDigits = signal<string[]>(['', '', '', '', '', '']);
  readonly isLoading = signal(false);

  onPinDigitInput(index: number, event: Event, nextInput?: HTMLInputElement, prevInput?: HTMLInputElement) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '').slice(0, 1);
    input.value = value;

    const digits = [...this.pinDigits()];
    digits[index] = value;
    this.pinDigits.set(digits);

    this.setupForm.get('pin')?.setValue(digits.join(''));
    this.setupForm.get(`pin${index + 1}`)?.setValue(value);

    if (value && nextInput) {
      nextInput.focus();
    }
  }

  onPinDigitKeydown(event: KeyboardEvent, index: number, prevInput?: HTMLInputElement) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && prevInput) {
      prevInput.focus();
    }
  }

  onSubmit() {
    if (this.setupForm.valid) {
      const { password, confirmPassword, pin } = this.setupForm.value;

      if (password !== confirmPassword) {
        console.error('Passwords do not match');
        return;
      }

      console.log('Form submitted:', { password, pin });
      // TODO: Call your AuthService or API here
    }
  }
}
