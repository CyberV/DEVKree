import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

type Step = 'identifier' | 'login-password' | 'signup-password';

@Component({
  selector: 'kree-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnDestroy {
  step: Step = 'identifier';
  identifier = '';
  password = '';
  identifierType: 'email' | 'phone' | '' = '';
  errorMsg = '';
  loading = false;
  attempts = 0;
  maxAttempts = 3;
  locked = false;

  // Country code support
  showCountryDropdown = false;
  selectedCountry = { code: '+1', flag: 'US', name: 'United States' };
  countries = [
    { code: '+1', flag: 'US', name: 'United States' },
    { code: '+44', flag: 'GB', name: 'United Kingdom' },
    { code: '+91', flag: 'IN', name: 'India' },
    { code: '+61', flag: 'AU', name: 'Australia' },
    { code: '+49', flag: 'DE', name: 'Germany' },
    { code: '+33', flag: 'FR', name: 'France' },
    { code: '+81', flag: 'JP', name: 'Japan' },
    { code: '+86', flag: 'CN', name: 'China' },
    { code: '+55', flag: 'BR', name: 'Brazil' },
    { code: '+7', flag: 'RU', name: 'Russia' },
    { code: '+82', flag: 'KR', name: 'South Korea' },
    { code: '+39', flag: 'IT', name: 'Italy' },
    { code: '+34', flag: 'ES', name: 'Spain' },
    { code: '+52', flag: 'MX', name: 'Mexico' },
    { code: '+971', flag: 'AE', name: 'UAE' },
    { code: '+966', flag: 'SA', name: 'Saudi Arabia' },
    { code: '+65', flag: 'SG', name: 'Singapore' },
    { code: '+27', flag: 'ZA', name: 'South Africa' },
    { code: '+234', flag: 'NG', name: 'Nigeria' },
    { code: '+254', flag: 'KE', name: 'Kenya' },
  ];

  private closeDropdownBound = this.closeDropdown.bind(this);

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnDestroy(): void {
    document.removeEventListener('click', this.closeDropdownBound);
  }

  get displayIdentifier(): string {
    if (this.identifierType === 'phone') {
      return `${this.selectedCountry.code} ${this.identifier}`;
    }
    return this.identifier;
  }

  detectType(): void {
    const v = this.identifier.trim();
    if (!v) {
      this.identifierType = '';
      return;
    }
    if (v.includes('@') || /[a-zA-Z]/.test(v)) {
      this.identifierType = 'email';
    } else {
      this.identifierType = 'phone';
    }
  }

  get identifierValid(): boolean {
    const v = this.identifier.trim();
    if (!v) return false;
    if (this.identifierType === 'email') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }
    if (this.identifierType === 'phone') {
      const digits = v.replace(/[^0-9]/g, '');
      return digits.length >= 7 && digits.length <= 15;
    }
    return v.length > 0;
  }

  get passwordValid(): boolean {
    return this.password.length >= 6;
  }

  toggleCountryDropdown(event: Event): void {
    event.stopPropagation();
    this.showCountryDropdown = !this.showCountryDropdown;
    if (this.showCountryDropdown) {
      setTimeout(() => document.addEventListener('click', this.closeDropdownBound), 0);
    }
  }

  selectCountry(country: typeof this.selectedCountry, event: Event): void {
    event.stopPropagation();
    this.selectedCountry = country;
    this.showCountryDropdown = false;
    document.removeEventListener('click', this.closeDropdownBound);
  }

  private closeDropdown(): void {
    this.showCountryDropdown = false;
    document.removeEventListener('click', this.closeDropdownBound);
  }

  async onIdentifierSubmit(): Promise<void> {
    if (!this.identifierValid || this.loading) return;
    this.loading = true;
    this.errorMsg = '';

    const fullIdentifier = this.identifierType === 'phone'
      ? `${this.selectedCountry.code}${this.identifier.replace(/[^0-9]/g, '')}`
      : this.identifier.trim();

    try {
      const exists = await this.auth.checkUser(fullIdentifier);
      this.step = exists ? 'login-password' : 'signup-password';
    } catch {
      this.errorMsg = 'Unable to reach server. Please try again.';
    }
    this.loading = false;
  }

  async onLoginSubmit(): Promise<void> {
    if (!this.passwordValid || this.loading || this.locked) return;
    this.loading = true;
    this.errorMsg = '';

    const fullIdentifier = this.identifierType === 'phone'
      ? `${this.selectedCountry.code}${this.identifier.replace(/[^0-9]/g, '')}`
      : this.identifier.trim();

    try {
      const res = await this.auth.login(fullIdentifier, this.password);
      if (res.success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.attempts++;
        if (this.attempts >= this.maxAttempts) {
          this.locked = true;
          this.errorMsg = 'Too many failed attempts. Please try again later.';
        } else {
          this.errorMsg = `Wrong password. ${this.maxAttempts - this.attempts} attempt(s) remaining.`;
        }
      }
    } catch {
      this.errorMsg = 'Unable to reach server. Please try again.';
    }
    this.loading = false;
  }

  async onSignupSubmit(): Promise<void> {
    if (!this.passwordValid || this.loading) return;
    this.loading = true;
    this.errorMsg = '';

    const data = {
      email: this.identifierType === 'email' ? this.identifier.trim() : '',
      phone: this.identifierType === 'phone'
        ? `${this.selectedCountry.code}${this.identifier.replace(/[^0-9]/g, '')}`
        : '',
      password: this.password,
    };

    try {
      const ok = await this.auth.signup(data);
      if (ok) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMsg = 'Signup failed. Please try again.';
      }
    } catch {
      this.errorMsg = 'Unable to reach server. Please try again.';
    }
    this.loading = false;
  }

  goBack(): void {
    this.step = 'identifier';
    this.password = '';
    this.errorMsg = '';
    this.attempts = 0;
    this.locked = false;
  }
}
