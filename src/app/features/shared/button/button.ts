import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-button, app-harborButton',
  standalone: true,
  imports: [NgIf, LucideAngularModule],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class harborButton {
  @Input() caption = '';
  @Input() icon?: any;
  @Input() buttonHeight = '32px';
  @Output() clicked = new EventEmitter<MouseEvent>();
}
