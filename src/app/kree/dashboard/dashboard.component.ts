import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'kree-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  readonly theme = this.themeService.theme;
  readonly user = this.auth.user;

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'fa-th-large' },
    { label: 'Missions', route: '/dashboard/missions', icon: 'fa-rocket' },
    { label: 'Impact', route: '/dashboard/impact', icon: 'fa-heart' },
    { label: 'Leaderboard', route: '/dashboard/leaderboard', icon: 'fa-trophy' },
  ];

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
