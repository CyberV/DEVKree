import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'kree-missions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-content">
      <div class="page-header">
        <svg viewBox="0 0 80 80" width="48" height="48">
          <path d="M40 10 L44 30 L60 20 L50 36 L70 40 L50 44 L60 60 L44 50 L40 70 L36 50 L20 60 L30 44 L10 40 L30 36 L20 20 L36 30 Z"
                fill="none" stroke="var(--kree-accent)" stroke-width="2"/>
        </svg>
        <h1>Missions</h1>
        <p class="subtitle">Choose a mission that speaks to you. Every action counts.</p>
      </div>

      <div class="mission-grid">
        <div *ngFor="let m of missions" class="mission-card" [class.featured]="m.featured">
          <div class="mission-badge" *ngIf="m.featured">Featured</div>
          <div class="mission-icon">{{ m.icon }}</div>
          <h3>{{ m.title }}</h3>
          <p>{{ m.description }}</p>
          <div class="mission-meta">
            <span class="mission-tag">{{ m.category }}</span>
            <span class="mission-points">{{ m.points }} pts</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>How Missions Work</h2>
        <div class="info-cards">
          <div class="info-card">
            <div class="info-num">1</div>
            <strong>Browse</strong>
            <p>Explore missions across categories like community service, environment, education, and health.</p>
          </div>
          <div class="info-card">
            <div class="info-num">2</div>
            <strong>Commit</strong>
            <p>Accept a mission and set a timeline. You'll receive guidance and reminders along the way.</p>
          </div>
          <div class="info-card">
            <div class="info-num">3</div>
            <strong>Complete</strong>
            <p>Log your completion with photos or notes. Earn points and unlock new levels.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-content { max-width: 800px; }
    .page-header { text-align: center; margin-bottom: 2.5rem; }
    .page-header h1 { font-size: 2rem; font-weight: 300; margin: 0.75rem 0 0.25rem; }
    .subtitle { color: var(--kree-fg-muted); }
    .mission-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2.5rem; }
    .mission-card { position: relative; background: var(--kree-surface); border: 1px solid var(--kree-border); border-radius: 12px; padding: 1.4rem; transition: border-color 0.2s, transform 0.2s; }
    .mission-card:hover { border-color: var(--kree-accent); transform: translateY(-2px); }
    .mission-card.featured { border-color: var(--kree-accent); }
    .mission-badge { position: absolute; top: 0.75rem; right: 0.75rem; font-size: 0.7rem; background: var(--kree-accent); color: var(--kree-bg); padding: 0.2rem 0.5rem; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
    .mission-icon { font-size: 2rem; margin-bottom: 0.5rem; }
    .mission-card h3 { font-size: 1.05rem; font-weight: 500; margin: 0.5rem 0; }
    .mission-card p { font-size: 0.85rem; color: var(--kree-fg-muted); line-height: 1.5; }
    .mission-meta { display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; font-size: 0.8rem; }
    .mission-tag { background: var(--kree-surface-strong); padding: 0.2rem 0.5rem; border-radius: 6px; }
    .mission-points { color: var(--kree-accent); font-weight: 500; }
    .section { margin-top: 1rem; }
    .section h2 { font-size: 1.3rem; font-weight: 400; margin-bottom: 1rem; }
    .info-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
    .info-card { background: var(--kree-surface); border-radius: 12px; padding: 1.2rem; }
    .info-num { width: 28px; height: 28px; border-radius: 50%; background: var(--kree-accent); color: var(--kree-bg); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; }
    .info-card strong { display: block; margin-bottom: 0.3rem; }
    .info-card p { font-size: 0.85rem; color: var(--kree-fg-muted); line-height: 1.5; margin: 0; }
  `],
})
export class MissionsComponent {
  missions = [
    { icon: '🎓', title: 'Mentor a Student', description: 'Dedicate 2 hours a week to guide a student in your area of expertise.', category: 'Education', points: 150, featured: true },
    { icon: '🌳', title: 'Plant 10 Trees', description: 'Join a local tree-planting drive or organize one in your neighborhood.', category: 'Environment', points: 100, featured: false },
    { icon: '🍲', title: 'Sponsor a Meal', description: 'Provide meals for 5 people in need through a local organization.', category: 'Community', points: 80, featured: false },
    { icon: '🧹', title: 'Neighborhood Cleanup', description: 'Organize or join a 2-hour cleanup drive in your area.', category: 'Environment', points: 90, featured: false },
    { icon: '📦', title: 'Donate Supplies', description: 'Collect and deliver school supplies to an underfunded school.', category: 'Education', points: 120, featured: true },
    { icon: '🏥', title: 'Hospital Visit', description: 'Spend an afternoon visiting and cheering up hospital patients.', category: 'Health', points: 110, featured: false },
  ];
}
