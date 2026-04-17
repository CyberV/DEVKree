import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { PledgeComponent } from '../pledge/pledge.component';

@Component({
  selector: 'kree-pledge-page',
  standalone: true,
  imports: [CommonModule, PledgeComponent],
  templateUrl: './pledge-page.component.html',
  styleUrls: ['./pledge-page.component.css'],
})
export class PledgePageComponent {
  pledgeComplete = false;

  constructor(
    private location: Location,
    private router: Router,
  ) {}

  goBack(): void {
    this.location.back();
  }

  onPledgeDone(): void {
    this.pledgeComplete = true;
  }

  goToAuth(): void {
    this.router.navigate(['/auth']);
  }
}
