import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pin-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pin-input.html',
})
export class PinInput {
  digits = [0, 1, 2, 3, 4, 5];
}