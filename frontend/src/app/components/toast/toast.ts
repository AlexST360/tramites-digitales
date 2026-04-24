import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

const ICONS: Record<string, string> = {
  success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️'
};

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
})
export class ToastComponent {
  toastSvc = inject(ToastService);
  icon(type: string) { return ICONS[type] ?? ''; }
}
