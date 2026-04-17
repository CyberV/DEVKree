import {
  Component,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ThisMomentComponent } from '../this-moment/this-moment.component';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'kree-landing',
  standalone: true,
  imports: [CommonModule, ThisMomentComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit, OnDestroy {
  public beginPledge = false;
  private readonly themeService = inject(ThemeService);
  public readonly theme = this.themeService.theme;
  private router = inject(Router);

  ngOnInit(): void {
    this.themeService.init();
  }

  ngOnDestroy(): void {}

  toggleTheme(): void {
    this.themeService.toggle();
  }

  onAnswered(val: boolean): void {
    this.beginPledge = val;
  }

  goToPledge(): void {
    this.router.navigate(['/pledge']);
  }
}
