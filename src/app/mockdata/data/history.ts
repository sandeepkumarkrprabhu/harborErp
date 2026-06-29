import { DeploymentHistory } from '../../Models/DeploymentHistory';

export const deployments: DeploymentHistory[] = [
  {
    slNo: 1,
    projectName: 'harbor-api',
    environmentName: 'Production',
    status: 'Success',
    triggeredBy: 'Alex K.',
    duration: '2m 15s',
    timestamp: '2026-06-20T08:45:00',
    prCommit: 'a1b2c3d',
    branch: 'main'
  },
  {
    slNo: 2,
    projectName: 'harbor-frontend',
    environmentName: 'Staging',
    status: 'In Progress',
    triggeredBy: 'Priya R.',
    duration: '1m 05s',
    timestamp: '2026-06-20T09:10:00',
    prCommit: 'd4e5f6g',
    branch: 'develop'
  },
  {
    slNo: 3,
    projectName: 'auth-service',
    environmentName: 'Development',
    status: 'Failed',
    triggeredBy: 'Sam T.',
    duration: '3m 40s',
    timestamp: '2026-06-19T22:30:00',
    prCommit: 'h7i8j9k',
    branch: 'feature/auth-refactor'
  },
  {
    slNo: 4,
    projectName: 'notification-worker',
    environmentName: 'Production',
    status: 'Success',
    triggeredBy: 'Zara M.',
    duration: '2m 00s',
    timestamp: '2026-06-20T07:55:00',
    prCommit: 'l0m1n2o',
    branch: 'main'
  },
  {
    slNo: 5,
    projectName: 'payment-gateway',
    environmentName: 'Production',
    status: 'Success',
    triggeredBy: 'John D.',
    duration: '4m 20s',
    timestamp: '2026-06-19T18:15:00',
    prCommit: 'p9q8r7s',
    branch: 'release/v2.1'
  },
  {
    slNo: 6,
    projectName: 'inventory-service',
    environmentName: 'QA',
    status: 'In Progress',
    triggeredBy: 'Meera L.',
    duration: '2m 45s',
    timestamp: '2026-06-20T10:05:00',
    prCommit: 't1u2v3w',
    branch: 'feature/stock-alerts'
  },
  {
    slNo: 7,
    projectName: 'user-profile',
    environmentName: 'Development',
    status: 'Failed',
    triggeredBy: 'Carlos M.',
    duration: '5m 10s',
    timestamp: '2026-06-19T21:00:00',
    prCommit: 'x4y5z6a',
    branch: 'feature/avatar-upload'
  },
  {
    slNo: 8,
    projectName: 'reporting-dashboard',
    environmentName: 'Staging',
    status: 'Success',
    triggeredBy: 'Nina P.',
    duration: '3m 30s',
    timestamp: '2026-06-20T06:40:00',
    prCommit: 'b7c8d9e',
    branch: 'develop'
  },
  {
    slNo: 9,
    projectName: 'email-service',
    environmentName: 'Production',
    status: 'In Progress',
    triggeredBy: 'Omar Q.',
    duration: '2m 50s',
    timestamp: '2026-06-20T11:20:00',
    prCommit: 'f1g2h3i',
    branch: 'main'
  },
  {
    slNo: 10,
    projectName: 'analytics-engine',
    environmentName: 'QA',
    status: 'Failed',
    triggeredBy: 'Sophia W.',
    duration: '6m 00s',
    timestamp: '2026-06-19T20:10:00',
    prCommit: 'j7k8l9m',
    branch: 'feature/data-pipeline'
  },
  {
    slNo: 11,
    projectName: 'chat-service',
    environmentName: 'Production',
    status: 'Success',
    triggeredBy: 'Rajesh B.',
    duration: '3m 05s',
    timestamp: '2026-06-20T05:25:00',
    prCommit: 'n0o1p2q',
    branch: 'main'
  },
  {
    slNo: 12,
    projectName: 'file-storage',
    environmentName: 'Development',
    status: 'In Progress',
    triggeredBy: 'Emily C.',
    duration: '4m 45s',
    timestamp: '2026-06-20T09:55:00',
    prCommit: 'r3s4t5u',
    branch: 'feature/cloud-sync'
  }
];
