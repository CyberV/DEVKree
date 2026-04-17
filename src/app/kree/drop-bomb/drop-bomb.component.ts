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
  selector: 'drop-bomb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drop-bomb.component.html',
  styleUrls: ['./drop-bomb.component.scss'],
})
export class DropBombComponent implements OnInit, OnDestroy {
  @Input() text = '';
  @Output() finished = new EventEmitter<void>();

  public label = '';

  private readonly startInterval = 2000;
  private readonly dropInterval = 1500;
  private timers: any[] = [];

  ngOnInit(): void {
    this.label = '';
    this.timers.push(setTimeout(() => this.drop(), this.startInterval));
  }

  ngOnDestroy(): void {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers = [];
  }

  drop(): void {
    if (this.label !== this.text) {
      this.label = this.text;
      this.timers.push(setTimeout(() => this.drop(), this.dropInterval));
    } else {
      this.finished.emit();
    }
  }
}
