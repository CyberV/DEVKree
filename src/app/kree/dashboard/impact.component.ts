import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'kree-impact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-content">
      <div class="page-header">
        <svg viewBox="0 0 80 80" width="48" height="48">
          <path d="M40 68 C40 68 12 48 12 30 C12 18 22 10 32 10 C36 10 39 12 40 14 C41 12 44 10 48 10 C58 10 68 18 68 30 C68 48 40 68 40 68Z"
                fill="none" stroke="var(--kree-accent)" stroke-width="2"/>
        </svg>
        <h1>Your Impact</h1>
        <p class="subtitle">Every action creates a ripple. Here's yours.</p>
      </div>

      <div class="impact-summary">
        <div class="impact-ring">
          <svg viewBox="0 0 120 120" width="140" height="140">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--kree-border)" stroke-width="8"/>
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--kree-accent)" stroke-width="8"
                    stroke-dasharray="327" stroke-dashoffset="295" stroke-linecap="round"
                    transform="rotate(-90 60 60)"/>
          </svg>
          <div class="ring-label">
            <span class="ring-value">10%</span>
            <span class="ring-text">Journey</span>
          </div>
        </div>
        <div class="impact-blurb">
          <h3>Just getting started</h3>
          <p>
            You've taken your pledge, and that's the hardest part. The next step is to
            complete your first mission. Every mission you finish grows your impact circle
            and brings you closer to real, tangible change.
          </p>
        </div>
      </div>

      <h2>Impact Categories</h2>
      <div class="category-grid">
        <div *ngFor="let cat of categories" class="category-card">
          <div class="cat-icon">{{ cat.icon }}</div>
          <div class="cat-info">
            <strong>{{ cat.name }}</strong>
            <div class="cat-bar">
              <div class="cat-fill" [style.width.%]="cat.progress"></div>
            </div>
            <span class="cat-stat">{{ cat.value }} {{ cat.unit }}</span>
          </div>
        </div>
      </div>

      <h2>Impact Stories</h2>
      <div class="stories">
        <div class="story-card" *ngFor="let s of stories">
          <div class="story-quote">"{{ s.quote }}"</div>
          <div class="story-author">-- {{ s.author }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-content { max-width: 800px; }
    .page-header { text-align: center; margin-bottom: 2.5rem; }
    .page-header h1 { font-size: 2rem; font-weight: 300; margin: 0.75rem 0 0.25rem; }
    .subtitle { color: var(--kree-fg-muted); }
    .impact-summary { display: flex; align-items: center; gap: 2rem; margin-bottom: 2.5rem; flex-wrap: wrap; }
    .impact-ring { position: relative; flex-shrink: 0; }
    .ring-label { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .ring-value { font-size: 1.6rem; font-weight: 500; }
    .ring-text { font-size: 0.8rem; color: var(--kree-fg-muted); }
    .impact-blurb h3 { font-weight: 400; margin-bottom: 0.5rem; }
    .impact-blurb p { color: var(--kree-fg-muted); line-height: 1.7; }
    h2 { font-size: 1.3rem; font-weight: 400; margin-bottom: 1rem; }
    .category-grid { display: grid; gap: 0.75rem; margin-bottom: 2.5rem; }
    .category-card { display: flex; align-items: center; gap: 1rem; background: var(--kree-surface); border-radius: 12px; padding: 1rem 1.2rem; }
    .cat-icon { font-size: 1.6rem; }
    .cat-info { flex: 1; }
    .cat-info strong { display: block; margin-bottom: 0.35rem; font-weight: 500; }
    .cat-bar { height: 6px; background: var(--kree-border); border-radius: 3px; overflow: hidden; margin-bottom: 0.3rem; }
    .cat-fill { height: 100%; background: var(--kree-accent); border-radius: 3px; transition: width 0.6s ease; }
    .cat-stat { font-size: 0.8rem; color: var(--kree-fg-muted); }
    .stories { display: grid; gap: 1rem; }
    .story-card { background: var(--kree-surface); border-radius: 12px; padding: 1.2rem 1.4rem; border-left: 3px solid var(--kree-accent); }
    .story-quote { font-style: italic; line-height: 1.6; color: var(--kree-fg-muted); }
    .story-author { margin-top: 0.5rem; font-size: 0.85rem; color: var(--kree-accent); }
  `],
})
export class ImpactComponent {
  categories = [
    { icon: '🎓', name: 'Education', progress: 0, value: 0, unit: 'hours mentored' },
    { icon: '🌳', name: 'Environment', progress: 0, value: 0, unit: 'trees planted' },
    { icon: '🍲', name: 'Community', progress: 10, value: 1, unit: 'pledge taken' },
    { icon: '🏥', name: 'Health', progress: 0, value: 0, unit: 'visits made' },
  ];

  stories = [
    { quote: 'The best time to plant a tree was twenty years ago. The second best time is now.', author: 'Chinese Proverb' },
    { quote: 'No one has ever become poor by giving.', author: 'Anne Frank' },
    { quote: 'We make a living by what we get, but we make a life by what we give.', author: 'Winston Churchill' },
  ];
}
