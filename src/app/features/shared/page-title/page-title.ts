import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-title',
  imports: [CommonModule],
  templateUrl: './page-title.html',
  styleUrl: './page-title.css',
})
export class PageTitle {
  @Input() title ='';
  @Input() description = '';
}