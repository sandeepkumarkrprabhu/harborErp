import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metric-tile.html',
  styleUrls: ['./metric-tile.css']
})
export class MetricTile {
  @Input() title!: string;
  @Input() value!: number;
  @Input() details: { label: string; value: number; textColor?: string; barColor?: string }[] = [];

  getPercentages() {
    const safeDetails = this.details || [];
    const total = safeDetails.reduce((sum, d) => sum + d.value, 0);
    return safeDetails.map(d => ({
      ...d,
      percent: total > 0 ? (d.value / total) * 100 : 0
    }));
  }
}
