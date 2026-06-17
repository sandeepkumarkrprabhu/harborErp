import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Deployment } from './models/Deployment';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History {
  deployments = signal<Deployment[]>([
    {
      id: 119,
      project: 'harbor-web',
      environment: 'production',
      status: 'running',
      user: 'Sam T.',
      duration: '1m 22s',
      timestamp: 'Jun 24, 2026 1:05 PM',
      commit: 'abc123',
      branch: 'feature/login',
    },
    {
      id: 118,
      project: 'harbor-api',
      environment: 'production',
      status: 'success',
      user: 'Alex K.',
      duration: '4m 12s',
      timestamp: 'Jun 24, 2026 12:05 PM',
      commit: 'def456',
      branch: 'main',
    },
    {
      id: 117,
      project: 'ocean-service',
      environment: 'production',
      status: 'failed',
      user: 'James R.',
      duration: '2m 15s',
      timestamp: 'Jun 24, 2026 11:45 AM',
      commit: 'ghi789',
      branch: 'release/v2',
    },
    {
      id: 116,
      project: 'river-api',
      environment: 'staging',
      status: 'running',
      user: 'Chris L.',
      duration: '58s',
      timestamp: 'Jun 24, 2026 10:55 AM',
      commit: 'jkl321',
      branch: 'feature/payment',
    },
    {
      id: 115,
      project: 'desert-service',
      environment: 'dev',
      status: 'pending',
      user: 'Taylor A.',
      duration: '—',
      timestamp: 'Jun 24, 2026 10:15 AM',
      commit: 'mno654',
      branch: 'feature/security',
    },
    {
      id: 114,
      project: 'forest-api',
      environment: 'qa',
      status: 'success',
      user: 'Morgan T.',
      duration: '3m 40s',
      timestamp: 'Jun 24, 2026 09:40 AM',
      commit: 'pqr987',
      branch: 'release/v3',
    },
  ]);
}