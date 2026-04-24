import { Component, signal, effect, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { ToastComponent } from './components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private router = inject(Router);
  authSvc = inject(AuthService);

  darkMode = signal(localStorage.getItem('darkMode') === 'true');

  constructor() {
    effect(() => {
      document.documentElement.setAttribute('data-theme', this.darkMode() ? 'dark' : 'light');
      localStorage.setItem('darkMode', String(this.darkMode()));
    });
  }

  toggleDark() { this.darkMode.update(d => !d); }

  logout() {
    this.authSvc.logout();
    this.router.navigate(['/login']);
  }

  isLoginPage() {
    return this.router.url === '/login';
  }
}
