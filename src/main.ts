import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { KreeComponent } from './app/kree/kree.component';
import { ThemeService } from './app/kree/services/theme.service';
import { LandingComponent } from './app/kree/landing/landing.component';
import { PledgePageComponent } from './app/kree/pledge-page/pledge-page.component';
import { AuthComponent } from './app/kree/auth/auth.component';
import { DashboardComponent } from './app/kree/dashboard/dashboard.component';
import { DashboardHomeComponent } from './app/kree/dashboard/dashboard-home.component';
import { MissionsComponent } from './app/kree/dashboard/missions.component';
import { ImpactComponent } from './app/kree/dashboard/impact.component';
import { LeaderboardComponent } from './app/kree/dashboard/leaderboard.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'pledge', component: PledgePageComponent },
  { path: 'auth', component: AuthComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'missions', component: MissionsComponent },
      { path: 'impact', component: ImpactComponent },
      { path: 'leaderboard', component: LeaderboardComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];

bootstrapApplication(KreeComponent, {
  providers: [
    importProvidersFrom(FormsModule),
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(),
    ThemeService,
  ],
}).then((ref) => {
  ref.injector.get(ThemeService).init();
}).catch((err) => console.error(err));
