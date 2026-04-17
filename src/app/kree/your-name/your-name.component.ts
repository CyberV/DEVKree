import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'your-name',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './your-name.component.html',
  styleUrls: ['./your-name.component.scss'],
})
export class YourNameComponent implements OnInit, OnDestroy {
  @Output() answered = new EventEmitter<void>();

  public name = '';
  public placeholder = 'Full Name';
  public meText = '';
  public mes: string[] = ['I', '\u092E\u0948\u0902', '\u0A2E\u0A48\u0A28\u0A42\u0A70', '\u0CA8\u0CBE\u0CA8\u0CC1', ' \u0645\u06CC\u06BA '];
  public currentMe = -1;

  public entering = false;
  public exiting = false;
  public hasName = false;
  public inputVisible = false;
  public inputWidth = 0;

  // Typeaway for "am here now."
  public amHereNowLabel = '';
  public showAmHereNow = false;

  private readonly showInterval = 1000;
  private timers: any[] = [];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.timers.push(setTimeout(() => this.nextMeText(), 500));
  }

  ngOnDestroy(): void {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers = [];
  }

  nextMeText(): void {
    if (this.currentMe < this.mes.length - 1) {
      this.exiting = false;
      this.entering = true;
      this.meText = this.mes[++this.currentMe];

      this.timers.push(
        setTimeout(() => {
          this.entering = false;
          this.exiting = true;

          this.timers.push(
            setTimeout(() => this.nextMeText(), this.showInterval),
          );
        }, this.showInterval),
      );
      return;
    }

    this.inputVisible = true;
    this.timers.push(
      setTimeout(() => {
        this.inputWidth = 300;
        this.timers.push(
          setTimeout(() => {
            const input =
              this.el?.nativeElement?.querySelector('.yourName') as HTMLInputElement | null;
            input?.focus();
          }, 1000),
        );
      }, 500),
    );
  }

  onNameInput(): void {
    this.resizeInput();
  }

  checkName(_key: KeyboardEvent | Event): void {
    this.resizeInput();
    const snapshot = this.name;
    this.timers.push(
      setTimeout(() => {
        if (snapshot === this.name && snapshot.trim().length > 0) {
          this.moveOn();
        }
      }, 3000),
    );
  }

  moveOn(): void {
    if (this.hasName) {
      return;
    }
    this.hasName = true;
    // Start typeaway for "am here now."
    this.showAmHereNow = true;
    this.typeAmHereNow();
  }

  private typeAmHereNow(): void {
    const fullText = 'am here now.';
    let idx = 0;
    const typeNext = () => {
      if (idx < fullText.length) {
        idx++;
        this.amHereNowLabel = fullText.substring(0, idx);
        const ch = fullText[idx - 1];
        const delay = ch === ',' ? 800 : 100;
        this.timers.push(setTimeout(typeNext, delay));
      } else {
        // Done typing — emit answered
        this.timers.push(setTimeout(() => this.answered.emit(), 500));
      }
    };
    this.timers.push(setTimeout(typeNext, 500));
  }

  private resizeInput(): void {
    if (!this.name) {
      this.inputWidth = 300;
      return;
    }
    // Approximate width: ~18px per character + padding, capped at 500
    const width = Math.max(60, this.name.length * 18 + 20);
    this.inputWidth = Math.min(width, 500);
  }
}
