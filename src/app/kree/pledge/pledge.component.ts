import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { YourNameComponent } from '../your-name/your-name.component';
import { TypeawayComponent } from '../typeaway/typeaway.component';
import { DropBombComponent } from '../drop-bomb/drop-bomb.component';

@Component({
  selector: 'pledge',
  standalone: true,
  imports: [
    CommonModule,
    YourNameComponent,
    TypeawayComponent,
    DropBombComponent,
  ],
  templateUrl: './pledge.component.html',
  styleUrls: ['./pledge.component.scss'],
})
export class PledgeComponent {
  public hasName = false;
  public drop = false;
  public good = false;
  public great = false;
  public because = false;
  public ican = false;
  public iwant = false;
  public ineed = false;

  @Output() pledgeDone = new EventEmitter<void>();

  onGoodDone(): void {
    // Delay to let strikethrough render before "great" appears
    setTimeout(() => { this.great = true; }, 800);
  }

  onFinalLine(): void {
    this.ineed = true;
    setTimeout(() => this.pledgeDone.emit(), 3000);
  }
}
