import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Team } from '../../../Models/Team';
import { LucideAngularModule } from 'lucide-angular';
import { getProjectStatus } from '../../../features/utils/string-utils'; 

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './team-card.html',
  styleUrls: ['./team-card.css'],
})
export class TeamCard {
  @Input() team!: Team;
  @Output() selectTeam = new EventEmitter<Team>();

  handleClick() {
    //console.log("selected Team:", this.team);
    this.selectTeam.emit(this.team);
  }
  
  getProjectStatus(healthy: number, unhealthy: number): string {
    return getProjectStatus(healthy, unhealthy);
  }

  getProjectColor(healthy?: number, unhealthy?: number): string {
    // If values are missing, fallback to your theme's primary color
    if (healthy == null || unhealthy == null) {
      return 'var(--tw-bg-primary)'; // assumes bg-primary is defined in your Tailwind config or CSS
    }

    // Healthy only → green
    if (healthy > 0 && unhealthy === 0) {
      return '#22c55e'; // Tailwind green-500
    }

    // Mixed healthy/unhealthy → yellow
    if (healthy > 0 && unhealthy > 0) {
      return '#eab308'; // Tailwind yellow-500
    }

    // Unhealthy only → red
    if (healthy === 0 && unhealthy > 0) {
      return '#ef4444'; // Tailwind red-500
    }

    // Default fallback → primary
    return 'var(--tw-bg-primary)';
  }

  getAvatarColor(name: string): string {
    // Map Tailwind theme tokens to actual colors
    const themeColors: Record<string, string> = {
      primary: 'var(--tw-bg-primary)',   // uses your defined bg-primary
      secondary: 'var(--tw-bg-secondary)' // uses your defined bg-secondary
    };

    // Fallback if name is missing
    if (!name || name.trim().length === 0) {
      return themeColors[0];
    }

    // Simple hash based on first character of name
    const code = name.charCodeAt(0);
    const usePrimary = code % 2 === 0;

    return usePrimary ? themeColors[0] : themeColors[1];
  }


}
