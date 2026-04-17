import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'kree-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-content">
      <div class="hero-section">
        <div class="hero-icon">
          <svg viewBox="0 0 120 120" width="80" height="80">
            <circle cx="60" cy="60" r="55" fill="none" stroke="var(--kree-accent)" stroke-width="2" opacity="0.3"/>
            <circle cx="60" cy="60" r="35" fill="none" stroke="var(--kree-accent)" stroke-width="2" opacity="0.5"/>
            <circle cx="60" cy="60" r="15" fill="var(--kree-accent)" opacity="0.7"/>
          </svg>
        </div>
        <h1>Your Dashboard</h1>
        <p class="subtitle">Track your pledges, missions, and impact</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon"><i class="fa fa-check-circle"></i></div>
          <div class="stat-value">1</div>
          <div class="stat-label">Pledge Taken</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fa fa-rocket"></i></div>
          <div class="stat-value">0</div>
          <div class="stat-label">Active Missions</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fa fa-heart"></i></div>
          <div class="stat-value">0</div>
          <div class="stat-label">Lives Impacted</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fa fa-star"></i></div>
          <div class="stat-value">0</div>
          <div class="stat-label">Points Earned</div>
        </div>
      </div>

      <div class="section">
        <h2>Getting Started</h2>
        <p>
          Welcome to Kree. You've taken the first step by making a pledge.
          Now it's time to turn intention into action. Browse available missions,
          track your impact, and see how you rank among fellow changemakers.
        </p>
        <div class="timeline">
          <div class="timeline-item completed">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <strong>Take a Pledge</strong>
              <span>Commit to making a difference</span>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <strong>Choose a Mission</strong>
              <span>Pick something meaningful to you</span>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <strong>Create Impact</strong>
              <span>Complete your mission and log your impact</span>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <strong>Inspire Others</strong>
              <span>Rise on the leaderboard and motivate the community</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-content { max-width: 800px; }
    .hero-section { text-align: center; margin-bottom: 2.5rem; }
    .hero-icon { margin-bottom: 1rem; }
    .hero-section h1 { font-size: 2rem; font-weight: 300; margin: 0.5rem 0; }
    .subtitle { color: var(--kree-fg-muted); font-size: 1.05rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 2.5rem; }
    .stat-card { background: var(--kree-surface); border: 1px solid var(--kree-border); border-radius: 12px; padding: 1.2rem; text-align: center; transition: border-color 0.2s; }
    .stat-card:hover { border-color: var(--kree-accent); }
    .stat-icon { font-size: 1.4rem; color: var(--kree-accent); margin-bottom: 0.5rem; }
    .stat-value { font-size: 2rem; font-weight: 500; }
    .stat-label { font-size: 0.8rem; color: var(--kree-fg-muted); margin-top: 0.25rem; }
    .section h2 { font-size: 1.3rem; font-weight: 400; margin-bottom: 0.75rem; }
    .section p { color: var(--kree-fg-muted); line-height: 1.7; margin-bottom: 1.5rem; }
    .timeline { position: relative; padding-left: 2rem; }
    .timeline::before { content: ''; position: absolute; left: 7px; top: 0; bottom: 0; width: 2px; background: var(--kree-border); }
    .timeline-item { position: relative; padding-bottom: 1.5rem; }
    .timeline-dot { position: absolute; left: -2rem; top: 2px; width: 16px; height: 16px; border-radius: 50%; background: var(--kree-surface); border: 2px solid var(--kree-border); }
    .timeline-item.completed .timeline-dot { background: var(--kree-accent); border-color: var(--kree-accent); }
    .timeline-content { display: flex; flex-direction: column; gap: 0.2rem; }
    .timeline-content strong { font-weight: 500; }
    .timeline-content span { font-size: 0.85rem; color: var(--kree-fg-muted); }
  `],
})
export class DashboardHomeComponent {}
