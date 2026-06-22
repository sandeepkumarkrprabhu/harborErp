import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.html',
  styleUrls: ['./button.css']
})
export class Button {
  @Input() variant: 'primary' | 'secondary' | 'neutral' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() fullWidth = false;
  @Input() disabled = false;
  @Input() width: string = '';
  @Input() height: string = '';
}