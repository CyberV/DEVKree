import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type DonationKind = 'time' | 'resources';

export interface DonationChoice {
  kind: DonationKind;
  option: string;
}

interface WizardOption {
  id: string;
  label: string;
  blurb: string;
  icon: string;
}

/**
 * Donation wizard — the "what now?" that lands after the pledge.
 *
 * Step 1. Ask how the user wants to donate: time, or resources.
 * Step 2. Show concrete options for the branch they picked.
 * Step 3. Confirm their choice with a small acknowledgement.
 */
@Component({
  selector: 'donation-wizard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donation-wizard.component.html',
  styleUrls: ['./donation-wizard.component.scss'],
})
export class DonationWizardComponent {
  @Output() finished = new EventEmitter<DonationChoice>();

  public step: 1 | 2 | 3 = 1;
  public kind: DonationKind | null = null;
  public selectedOption: WizardOption | null = null;

  public readonly timeOptions: WizardOption[] = [
    {
      id: 'mentor',
      label: 'Mentor a student',
      blurb: 'Share what you know with someone early in their path.',
      icon: '📚',
    },
    {
      id: 'clean',
      label: 'Join a local clean-up',
      blurb: 'Two hours on a Saturday, a cleaner street or river.',
      icon: '🧹',
    },
    {
      id: 'hospital',
      label: 'Visit a hospital / elder home',
      blurb: 'Keep someone company who is not expecting anyone.',
      icon: '🤝',
    },
    {
      id: 'skill',
      label: 'Teach a skill you already have',
      blurb: 'Photography, code, cooking — it counts.',
      icon: '🧑‍🏫',
    },
  ];

  public readonly resourceOptions: WizardOption[] = [
    {
      id: 'money',
      label: 'Donate money',
      blurb: 'A one-time or recurring gift to a cause you trust.',
      icon: '💸',
    },
    {
      id: 'materials',
      label: 'Donate materials',
      blurb: 'Clothes, books, blankets, food — things someone needs today.',
      icon: '📦',
    },
    {
      id: 'infra',
      label: 'Donate infrastructure',
      blurb: 'Compute, office space, tools, transport — leverage what you own.',
      icon: '🏗️',
    },
    {
      id: 'food',
      label: 'Sponsor a meal / medicine',
      blurb: 'Cover a specific named need for a specific person.',
      icon: '🍲',
    },
  ];

  get currentOptions(): WizardOption[] {
    return this.kind === 'time' ? this.timeOptions : this.resourceOptions;
  }

  chooseKind(kind: DonationKind): void {
    this.kind = kind;
    this.step = 2;
  }

  chooseOption(option: WizardOption): void {
    this.selectedOption = option;
    this.step = 3;
  }

  back(): void {
    if (this.step === 3) {
      this.step = 2;
      this.selectedOption = null;
      return;
    }
    if (this.step === 2) {
      this.step = 1;
      this.kind = null;
    }
  }

  confirm(): void {
    if (!this.kind || !this.selectedOption) {
      return;
    }
    this.finished.emit({
      kind: this.kind,
      option: this.selectedOption.label,
    });
  }
}
