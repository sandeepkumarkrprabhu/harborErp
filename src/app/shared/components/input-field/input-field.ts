import { Component, Input, Optional, Self } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './input-field.html',
  styleUrls: ['./input-field.css']
})
export class InputField implements ControlValueAccessor {

  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  @Input() label: string = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'search' | 'date' = 'text';
  @Input() placeholder: string = '';
  @Input() helperText: string = '';
  @Input() errorMessage: string = '';
  @Input() leftIcon: any = null;
  @Input() rightIcon: any = null;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;

  value: string = '';
  isFocused: boolean = false;
  showPassword: boolean = false;

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  get inputType(): string {
    if (this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    return this.type;
  }

  get hasError(): boolean {
    if (!this.ngControl) return false;
    return !!(this.ngControl.invalid && (this.ngControl.dirty || this.ngControl.touched));
  }

  get resolvedErrorMessage(): string {
    if (!this.ngControl?.errors) return '';
    const errors = this.ngControl.errors;
    if (this.errorMessage) return this.errorMessage;
    if (errors['required']) return `${this.label || 'This field'} is required.`;
    if (errors['email']) return 'Please enter a valid email address.';
    if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} characters required.`;
    if (errors['maxlength']) return `Maximum ${errors['maxlength'].requiredLength} characters allowed.`;
    if (errors['min']) return `Minimum value is ${errors['min'].min}.`;
    if (errors['max']) return `Maximum value is ${errors['max'].max}.`;
    return 'Invalid value.';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}