import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  username = signal('');
  password = signal('');
  loading = signal(false);
  showPass = signal(false);

  login() {
    if (!this.username() || !this.password()) {
      this.toast.warning('Completa todos los campos');
      return;
    }
    this.loading.set(true);
    this.auth.login(this.username(), this.password()).subscribe({
      next: () => {
        this.toast.success('Bienvenido al sistema');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.toast.error('Credenciales incorrectas');
        this.loading.set(false);
      },
    });
  }
}
