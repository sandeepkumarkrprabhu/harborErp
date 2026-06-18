import { Component } from '@angular/core';
import { RecentActivity } from '../models/RecentActivity';

@Component({
  selector: 'app-dashboard-activity',
  standalone: true,
  imports: [],
  templateUrl: './activity.html',
  styleUrl: './activity.css',
})
export class Activity {

  activities: RecentActivity[] = [
    {
      id: 1,
      application: 'payment-service',
      environment: 'DEV',
      deployedBy: 'Ajith',
      timestamp: '2 mins ago'
    },
    {
      id: 2,
      application: 'user-authentication',
      environment: 'UAT',
      deployedBy: 'Mohan',
      timestamp: '15 mins ago'
    },
    {
      id: 3,
      application: 'order-management',
      environment: 'QA',
      deployedBy: 'Vivek',
      timestamp: '25 mins ago'
    },
    {
      id: 4,
      application: 'inventory-tracking',
      environment: 'PROD',
      deployedBy: 'Sita',
      timestamp: '45 mins ago'
    },
    {
      id: 5,
      application: 'notification-system',
      environment: 'DEV',
      deployedBy: 'John',
      timestamp: '1 hour ago'
    },
    {
      id: 6,
      application: 'report-generator',
      environment: 'QA',
      deployedBy: 'Sophia',
      timestamp: '2 hours ago'
    },
    {
      id: 7,
      application: 'customer-support',
      environment: 'UAT',
      deployedBy: 'Rahul',
      timestamp: '3 hours ago'
    },
    {
      id: 8,
      application: 'analytics-dashboard',
      environment: 'PROD',
      deployedBy: 'Nikhila',
      timestamp: '5 hours ago'
    }
  ];

  getEnvironmentClass(environment: string): string {
    switch (environment) {
      case 'DEV':
        return 'bg-blue-100 text-blue-700';

      case 'QA':
        return 'bg-yellow-100 text-yellow-700';

      case 'UAT':
        return 'bg-purple-100 text-purple-700';

      case 'PROD':
        return 'bg-green-100 text-green-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  }
}