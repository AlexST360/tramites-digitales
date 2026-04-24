import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export interface AuthUser { id: number; username: string; nombre: string; role: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:3000/api/auth';
  user = signal<AuthUser | null>(this.loadUser());

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ access_token: string; user: AuthUser }>(`${this.api}/login`, { username, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.user.set(res.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user.set(null);
  }

  isLoggedIn() { return !!localStorage.getItem('token'); }
  getToken()   { return localStorage.getItem('token'); }

  private loadUser(): AuthUser | null {
    try { return JSON.parse(localStorage.getItem('user') ?? 'null'); } catch { return null; }
  }
}
