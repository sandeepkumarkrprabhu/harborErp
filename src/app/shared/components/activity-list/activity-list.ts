import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRecentActivities } from '../../../Models/Composition';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-list.html',
  styleUrls: ['./activity-list.css'],
})
export class ActivityList implements OnChanges, OnInit {
  @Input() activities: DashboardRecentActivities[] = [];

  ngOnInit() {
    //console.log('ActivityList initialized with activities:', this.activities);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activities']) {
      //console.log('Activities input changed:', changes['activities'].currentValue);
    }
  }
}
