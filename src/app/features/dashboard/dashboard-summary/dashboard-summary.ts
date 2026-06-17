import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardSummaryModel } from '../models/dashboard-card.model';

@Component({
  selector: 'app-dashboard-summary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-summary.html',
  styleUrl: './dashboard-summary.css'
})
export class DashboardSummaryCard {

  @Input({ required: true })
  card!: DashboardSummaryModel;
}