import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export interface Toast { id: number; message: string; type: ToastType; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private nextId = 0;

  private show(message: string, type: ToastType) {
    const id = this.nextId++;
    this.toasts.update(t => [...t, { id, message, type }]);
    setTimeout(() => this.remove(id), 3500);
  }

  success(msg: string) { this.show(msg, 'success'); }
  error(msg: string)   { this.show(msg, 'error'); }
  warning(msg: string) { this.show(msg, 'warning'); }
  info(msg: string)    { this.show(msg, 'info'); }

  remove(id: number) {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }
}
