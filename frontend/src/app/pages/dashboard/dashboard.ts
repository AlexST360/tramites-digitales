import { Component, inject, signal, viewChild, ElementRef, afterNextRender, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { TramitesService, TramiteStats } from '../../services/tramites';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private svc = inject(TramitesService);
  private chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart: Chart | null = null;

  stats = toSignal(this.svc.getStats(), {
    initialValue: { total: 0, pendiente: 0, en_proceso: 0, completado: 0, rechazado: 0 } as TramiteStats,
  });

  cards = [
    { label: 'Total', key: 'total', color: '#1a73e8', icon: '📋' },
    { label: 'Pendientes', key: 'pendiente', color: '#f59e0b', icon: '⏳' },
    { label: 'En Proceso', key: 'en_proceso', color: '#3b82f6', icon: '🔄' },
    { label: 'Completados', key: 'completado', color: '#10b981', icon: '✅' },
    { label: 'Rechazados', key: 'rechazado', color: '#ef4444', icon: '❌' },
  ];

  constructor() {
    afterNextRender(() => {
      this.initChart();
    });

    effect(() => {
      const s = this.stats();
      if (this.chart && s.total > 0) {
        this.chart.data.datasets[0].data = [s.pendiente, s.en_proceso, s.completado, s.rechazado];
        this.chart.update();
      }
    });
  }

  private initChart() {
    const canvas = this.chartCanvas()?.nativeElement;
    if (!canvas) return;

    const s = this.stats();
    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Pendiente', 'En Proceso', 'Completado', 'Rechazado'],
        datasets: [{
          data: [s.pendiente, s.en_proceso, s.completado, s.rechazado],
          backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'],
          borderWidth: 2,
          borderColor: '#fff',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { padding: 20, font: { size: 13 } } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} trámites` } },
        },
        cutout: '65%',
      },
    });
  }

  getValue(key: string): number {
    return (this.stats() as any)[key] ?? 0;
  }
}
