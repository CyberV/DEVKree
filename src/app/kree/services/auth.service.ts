import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<AuthUser | null>(null);
  readonly token = signal<string | null>(null);

  constructor(private http: HttpClient) {
    const stored = this.readStored();
    if (stored) {
      this.user.set(stored.user);
      this.token.set(stored.token);
    }
  }

  isLoggedIn(): boolean {
    return !!this.token();
  }

  async checkUser(identifier: string): Promise<boolean> {
    const res = await firstValueFrom(
      this.http.post<{ exists: boolean }>('/api/auth/check', { identifier })
    );
    return res.exists;
  }

  async login(identifier: string, password: string): Promise<{ success: boolean; message?: string }> {
    const res = await firstValueFrom(
      this.http.post<{ success: boolean; message?: string; token?: string; user?: AuthUser }>(
        '/api/auth/login', { identifier, password }
      )
    );
    if (res.success && res.token && res.user) {
      this.token.set(res.token);
      this.user.set(res.user);
      this.persist(res.token, res.user);
    }
    return { success: res.success, message: res.message };
  }

  async signup(data: { email: string; phone: string; password: string }): Promise<boolean> {
    const res = await firstValueFrom(
      this.http.post<{ token: string; user: AuthUser }>('/api/auth/signup', data)
    );
    if (res.token && res.user) {
      this.token.set(res.token);
      this.user.set(res.user);
      this.persist(res.token, res.user);
      return true;
    }
    return false;
  }

  logout(): void {
    this.token.set(null);
    this.user.set(null);
    try { localStorage?.removeItem('kree.auth'); } catch {}
  }

  private persist(token: string, user: AuthUser): void {
    try { localStorage?.setItem('kree.auth', JSON.stringify({ token, user })); } catch {}
  }

  private readStored(): { token: string; user: AuthUser } | null {
    try {
      const v = localStorage?.getItem('kree.auth');
      if (v) return JSON.parse(v);
    } catch {}
    return null;
  }
}
