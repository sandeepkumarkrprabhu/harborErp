import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardSummaryModel } from '../models/card.model';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.html',
  styleUrl: './summary.css'
})
export class SummaryCard {

  @Input({ required: true })
  card!: DashboardSummaryModel;
}
