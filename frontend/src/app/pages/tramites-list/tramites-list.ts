import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, switchMap, startWith, catchError, of } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TramitesService, Tramite, TramiteFiltros, TramitePage } from '../../services/tramites';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-tramites-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tramites-list.html',
  styleUrl: './tramites-list.scss',
})
export class TramitesList {
  private svc   = inject(TramitesService);
  private toast = inject(ToastService);
  private reload$ = new Subject<TramiteFiltros>();

  busqueda     = signal('');
  filtroEstado = signal('');
  filtroTipo   = signal('');
  filtroDesde  = signal('');
  filtroHasta  = signal('');
  page         = signal(1);
  limit        = 10;

  private empty: TramitePage = { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };

  result = toSignal(
    this.reload$.pipe(
      startWith(this.buildFiltros()),
      switchMap(f =>
        this.svc.getAll(f).pipe(catchError(() => {
          this.toast.error('Error al cargar los trámites');
          return of(this.empty);
        }))
      )
    ),
    { initialValue: this.empty }
  );

  tramites      = computed(() => this.result().data);
  totalPages    = computed(() => this.result().totalPages);
  total         = computed(() => this.result().total);
  pages         = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  tramitesFiltrados = computed(() => {
    const q = this.busqueda().toLowerCase();
    if (!q) return this.tramites();
    return this.tramites().filter(t =>
      t.titulo.toLowerCase().includes(q) || t.solicitante.toLowerCase().includes(q)
    );
  });

  private buildFiltros(): TramiteFiltros {
    return {
      estado:     this.filtroEstado() || undefined,
      tipo:       this.filtroTipo()   || undefined,
      fechaDesde: this.filtroDesde()  || undefined,
      fechaHasta: this.filtroHasta()  || undefined,
      page:       this.page(),
      limit:      this.limit,
    };
  }

  aplicarFiltros(resetPage = true) {
    if (resetPage) this.page.set(1);
    this.reload$.next(this.buildFiltros());
  }

  limpiarFiltros() {
    this.filtroEstado.set(''); this.filtroTipo.set('');
    this.filtroDesde.set(''); this.filtroHasta.set('');
    this.busqueda.set('');
    this.aplicarFiltros();
  }

  goToPage(p: number) {
    this.page.set(p);
    this.aplicarFiltros(false);
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar este trámite?')) return;
    this.svc.delete(id).subscribe({
      next: () => { this.toast.success('Trámite eliminado'); this.aplicarFiltros(); },
      error: () => this.toast.error('No se pudo eliminar'),
    });
  }

  exportarPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Reporte de Trámites', 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}  |  Total: ${this.total()} registros`, 14, 26);

    autoTable(doc, {
      startY: 32,
      head: [['#', 'Título', 'Tipo', 'Solicitante', 'Fecha', 'Estado']],
      body: this.tramitesFiltrados().map(t => [String(t.id ?? ''), t.titulo, t.tipo, t.solicitante, t.fecha, t.estado]),
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { fontSize: 9 },
    });

    doc.save(`tramites-${new Date().toISOString().split('T')[0]}.pdf`);
    this.toast.success('PDF exportado correctamente');
  }

  badgeClass(estado: string) {
    return ({ pendiente: 'badge badge-pendiente', en_proceso: 'badge badge-proceso', completado: 'badge badge-completado', rechazado: 'badge badge-rechazado' }[estado] ?? 'badge');
  }
}
