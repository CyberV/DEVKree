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
  selector: 'typeaway',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './typeaway.component.html',
  styleUrls: ['./typeaway.component.scss'],
})
export class TypeawayComponent implements OnInit, OnDestroy {
  @Input() text = 'At this moment, I pledge';
  @Output() finished = new EventEmitter<void>();

  public label = '';

  private readonly startInterval = 2000;
  private readonly typeInterval = 100;
  private timers: any[] = [];

  ngOnInit(): void {
    this.label = '';
    this.timers.push(setTimeout(() => this.showNextChar(), this.startInterval));
  }

  ngOnDestroy(): void {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers = [];
  }

  showNextChar(): void {
    if (this.label.length !== this.text.length) {
      this.label = this.text.substring(0, this.label.length + 1);
      const lastChar = this.label[this.label.length - 1];
      const delay = lastChar === ',' ? 8 * this.typeInterval : this.typeInterval;
      this.timers.push(setTimeout(() => this.showNextChar(), delay));
    } else {
      this.finished.emit();
    }
  }
}
