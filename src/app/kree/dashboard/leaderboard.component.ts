import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'kree-leaderboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-content">
      <div class="page-header">
        <svg viewBox="0 0 80 80" width="48" height="48">
          <rect x="10" y="40" width="16" height="30" rx="3" fill="none" stroke="var(--kree-accent)" stroke-width="2"/>
          <rect x="32" y="20" width="16" height="50" rx="3" fill="none" stroke="var(--kree-accent)" stroke-width="2"/>
          <rect x="54" y="32" width="16" height="38" rx="3" fill="none" stroke="var(--kree-accent)" stroke-width="2"/>
          <circle cx="40" cy="12" r="5" fill="var(--kree-accent)"/>
        </svg>
        <h1>Leaderboard</h1>
        <p class="subtitle">See how the community is making a difference together.</p>
      </div>

      <div class="podium">
        <div *ngFor="let p of topThree; let i = index" class="podium-slot" [class]="'rank-' + (i + 1)">
          <div class="podium-avatar">{{ p.initials }}</div>
          <div class="podium-name">{{ p.name }}</div>
          <div class="podium-points">{{ p.points }} pts</div>
          <div class="podium-bar"></div>
          <div class="podium-rank">#{{ i + 1 }}</div>
        </div>
      </div>

      <div class="leaderboard-table">
        <div class="lb-header">
          <span class="lb-col rank">Rank</span>
          <span class="lb-col name">Name</span>
          <span class="lb-col missions">Missions</span>
          <span class="lb-col points">Points</span>
        </div>
        <div *ngFor="let entry of leaderboard; let i = index" class="lb-row" [class.highlight]="entry.isYou">
          <span class="lb-col rank">{{ i + 1 }}</span>
          <span class="lb-col name">
            {{ entry.name }}
            <span *ngIf="entry.isYou" class="you-badge">You</span>
          </span>
          <span class="lb-col missions">{{ entry.missions }}</span>
          <span class="lb-col points">{{ entry.points }}</span>
        </div>
      </div>

      <div class="section">
        <h2>How Points Work</h2>
        <p>
          Points are earned by completing missions. Different missions carry different
          point values based on their difficulty and impact. Bonus points are awarded
          for streaks and community nominations.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .page-content { max-width: 800px; }
    .page-header { text-align: center; margin-bottom: 2.5rem; }
    .page-header h1 { font-size: 2rem; font-weight: 300; margin: 0.75rem 0 0.25rem; }
    .subtitle { color: var(--kree-fg-muted); }
    .podium { display: flex; justify-content: center; align-items: flex-end; gap: 1rem; margin-bottom: 2.5rem; padding: 0 1rem; }
    .podium-slot { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
    .podium-avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--kree-surface-strong); border: 2px solid var(--kree-border); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.9rem; }
    .rank-1 .podium-avatar { border-color: var(--kree-accent); width: 56px; height: 56px; }
    .podium-name { font-size: 0.85rem; font-weight: 500; }
    .podium-points { font-size: 0.75rem; color: var(--kree-accent); }
    .podium-bar { width: 60px; border-radius: 6px 6px 0 0; background: var(--kree-surface-strong); }
    .rank-1 .podium-bar { height: 80px; background: var(--kree-accent); opacity: 0.3; }
    .rank-2 .podium-bar { height: 60px; }
    .rank-3 .podium-bar { height: 45px; }
    .podium-rank { font-size: 0.75rem; color: var(--kree-fg-muted); }
    .leaderboard-table { background: var(--kree-surface); border-radius: 12px; overflow: hidden; margin-bottom: 2.5rem; }
    .lb-header { display: flex; padding: 0.75rem 1rem; font-size: 0.8rem; color: var(--kree-fg-muted); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--kree-border); }
    .lb-row { display: flex; padding: 0.7rem 1rem; font-size: 0.9rem; border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
    .lb-row:hover { background: var(--kree-surface-strong); }
    .lb-row.highlight { background: rgba(245,215,122,0.08); }
    .lb-col.rank { width: 50px; }
    .lb-col.name { flex: 1; display: flex; align-items: center; gap: 0.5rem; }
    .lb-col.missions { width: 80px; text-align: center; }
    .lb-col.points { width: 80px; text-align: right; color: var(--kree-accent); font-weight: 500; }
    .you-badge { font-size: 0.65rem; background: var(--kree-accent); color: var(--kree-bg); padding: 0.1rem 0.4rem; border-radius: 4px; text-transform: uppercase; }
    .section h2 { font-size: 1.3rem; font-weight: 400; margin-bottom: 0.5rem; }
    .section p { color: var(--kree-fg-muted); line-height: 1.7; }
  `],
})
export class LeaderboardComponent {
  topThree = [
    { name: 'Priya S.', initials: 'PS', points: 1250 },
    { name: 'Alex K.', initials: 'AK', points: 980 },
    { name: 'Maria L.', initials: 'ML', points: 870 },
  ];

  leaderboard = [
    { name: 'Priya S.', missions: 12, points: 1250, isYou: false },
    { name: 'Alex K.', missions: 9, points: 980, isYou: false },
    { name: 'Maria L.', missions: 8, points: 870, isYou: false },
    { name: 'James T.', missions: 7, points: 720, isYou: false },
    { name: 'Lin W.', missions: 6, points: 650, isYou: false },
    { name: 'Sam R.', missions: 5, points: 540, isYou: false },
    { name: 'You', missions: 0, points: 0, isYou: true },
  ];
}
