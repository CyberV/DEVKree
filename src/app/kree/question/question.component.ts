import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit, OnDestroy {
  @Input() q = '';
  @Input() answer = '';
  @Output() answered = new EventEmitter<boolean>();

  public label = '';
  public prompt = false;
  public showAnswer = false;
  public hasAnswered = false;

  private readonly startInterval = 1000;
  private readonly promptInterval = 3000;
  private readonly typeInterval = 100;
  private readonly markInterval = 500;
  private readonly markMax = 3;
  private markCounter = 0;

  private timers: any[] = [];

  ngOnInit(): void {
    this.label = '';
    this.markCounter = 0;
    this.showAnswer = false;
    this.hasAnswered = false;
    this.prompt = false;

    this.timers.push(
      setTimeout(() => this.showNextChar(), this.startInterval),
    );
  }

  ngOnDestroy(): void {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers = [];
  }

  toggleQuestionMark(): void {
    if (this.label.charAt(this.label.length - 1) === '?') {
      this.label = this.label.substring(0, this.label.length - 1);
      this.timers.push(
        setTimeout(() => this.toggleQuestionMark(), this.markInterval),
      );
      return;
    }

    this.label += '?';
    this.markCounter++;
    if (this.markCounter < this.markMax) {
      this.timers.push(
        setTimeout(() => this.toggleQuestionMark(), this.markInterval),
      );
    } else {
      this.showAnswer = true;
      this.timers.push(
        setTimeout(() => {
          this.prompt = true;
          this.timers.push(setTimeout(() => this.onClick(), 1500));
        }, this.promptInterval),
      );
    }
  }

  onClick(): void {
    if (this.hasAnswered) {
      return;
    }
    this.hasAnswered = true;
    this.answered.emit(true);
  }

  showNextChar(): void {
    if (this.label.length !== this.q.length) {
      this.label = this.q.substring(0, this.label.length + 1);
      this.timers.push(
        setTimeout(() => this.showNextChar(), this.typeInterval),
      );
    } else {
      this.toggleQuestionMark();
    }
  }
}
