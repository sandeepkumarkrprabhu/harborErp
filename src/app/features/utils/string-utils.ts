export function getProjectStatus(healthy: number, unhealthy: number): string {
  if (healthy > 0 && unhealthy === 0) return 'bg-green-500';
  if (healthy > 0 && unhealthy > 0) return 'bg-yellow-500';
  if (unhealthy > 0 && healthy === 0) return 'bg-red-500';
  return 'bg-gray-400';
}
