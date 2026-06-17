export interface DashboardSummaryModel {
  title: string;
  value: string | number;
  icon: string;

  success?: string | number;
  successColor?: string;
  successPercentage?: number;

  inProgress?: string | number;
  inProgressColor?: string;
  inProgressPercentage?: number;

  failure?: string | number;
  failureColor?: string;
  failurePercentage?: number;

  subtitle?: string;
}