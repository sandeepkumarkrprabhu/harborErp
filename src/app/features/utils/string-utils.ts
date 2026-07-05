export function getProjectStatus(
  healthy?: number,
  unhealthy?: number,
  status?: string
): string {
  // If both values are missing/null, check status string
  if (healthy == null && unhealthy == null && status) {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-red-500';
      case 'degraded':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  }

  // Normal logic when healthy/unhealthy are present
  if ((healthy ?? 0) > 0 && (unhealthy ?? 0) === 0) return 'bg-green-500';
  if ((healthy ?? 0) > 0 && (unhealthy ?? 0) > 0) return 'bg-yellow-500';
  if ((unhealthy ?? 0) > 0 && (healthy ?? 0) === 0) return 'bg-red-500';

  return 'bg-gray-400';
}
