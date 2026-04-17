import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-kree',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  template: '<router-outlet></router-outlet>',
  styles: [':host { display: block; }'],
})
export class KreeComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  public readonly theme = this.themeService.theme;

  ngOnInit(): void {
    this.themeService.init();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
