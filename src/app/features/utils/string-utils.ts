// src/app/utils/string-utils.ts

/**
 * Get Tailwind background class for project status.
 * Decides based on healthy/unhealthy counts or status string.
 */
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

/**
 * Generate initials from a full name.
 */
export function getInitials(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generate a full Tailwind class string for avatar styling.
 * Cycles through layered primary/secondary colors.
 */
export function getAvatarClass(name?: string): string {
  const base =
    'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0';

  if (!name) return `${base} bg-secondary/20`;

  const colors = [
    'bg-primary/20',
    'bg-primary/40',
    'bg-primary/60',
    'bg-secondary/20',
    'bg-secondary/40',
    'bg-secondary/60'
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colorClass = colors[Math.abs(hash) % colors.length];
  return `${base} ${colorClass}`;
}
