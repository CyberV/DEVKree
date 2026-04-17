import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionComponent } from '../question/question.component';

@Component({
  selector: 'this-moment',
  standalone: true,
  imports: [CommonModule, QuestionComponent],
  templateUrl: './this-moment.component.html',
  styleUrls: ['./this-moment.component.css'],
})
export class ThisMomentComponent implements OnInit, OnDestroy {
  public firstAnswered = false;
  public secondAnswered = false;
  public isMobile = false;

  public begin = false;
  public paused = false;
  public ready = false;
  public showCta = false;

  /** drives the breathe-in / breathe-out visual — loops continuously */
  public breathe: 'in' | 'out' | 'idle' = 'idle';

  @Output() answered = new EventEmitter<boolean>();

  private timers: any[] = [];
  private resetTimer: any = null;

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      this.isMobile = true;
    }

    this.startSequence();
  }

  ngOnDestroy(): void {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers = [];
    if (this.resetTimer) clearTimeout(this.resetTimer);
  }

  private startSequence(): void {
    // Start breathing immediately — runs continuously
    this.breathe = 'in';

    this.timers.push(
      setTimeout(() => {
        this.begin = true;

        this.timers.push(
          setTimeout(() => {
            this.paused = true;
            this.breathe = 'out';

            this.timers.push(
              setTimeout(() => {
                this.ready = true;
                // Keep breathing — alternate between in/out continuously
                this.breathe = 'in';
              }, 2000),
            );
          }, 2000),
        );
      }, 1500),
    );
  }

  next(): void {
    // Show CTA, questions stay visible
    this.showCta = true;
    this.answered.emit(true);

    // After 10 seconds of CTA visibility, reset the entire flow
    this.resetTimer = setTimeout(() => this.resetFlow(), 10000);
  }

  private resetFlow(): void {
    // Clear everything
    this.timers.forEach((t) => clearTimeout(t));
    this.timers = [];

    // Reset state
    this.firstAnswered = false;
    this.secondAnswered = false;
    this.begin = false;
    this.paused = false;
    this.ready = false;
    this.showCta = false;
    this.breathe = 'idle';

    // Restart the entire sequence
    this.startSequence();
  }
}
