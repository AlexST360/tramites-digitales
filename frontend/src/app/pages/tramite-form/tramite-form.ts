import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { TramitesService, Tramite } from '../../services/tramites';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-tramite-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tramite-form.html',
  styleUrl: './tramite-form.scss',
})
export class TramiteForm implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private svc    = inject(TramitesService);
  private toast  = inject(ToastService);

  esEdicion = signal(false);
  loading   = signal(false);
  id: number | null = null;

  titulo     = signal('');
  tipo       = signal('');
  estado     = signal<Tramite['estado']>('pendiente');
  solicitante = signal('');
  fecha      = signal(new Date().toISOString().split('T')[0]);

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.esEdicion.set(true);
      this.id = +idParam;
      this.svc.getOne(this.id).subscribe({
        next: t => {
          this.titulo.set(t.titulo); this.tipo.set(t.tipo);
          this.estado.set(t.estado); this.solicitante.set(t.solicitante);
          this.fecha.set(t.fecha);
        },
        error: () => { this.toast.error('No se pudo cargar el trámite'); this.router.navigate(['/tramites']); },
      });
    }
  }

  guardar() {
    if (!this.titulo() || !this.tipo() || !this.solicitante() || !this.fecha()) {
      this.toast.warning('Completa todos los campos obligatorios');
      return;
    }
    this.loading.set(true);
    const payload: Tramite = {
      titulo: this.titulo(), tipo: this.tipo(),
      estado: this.estado(), solicitante: this.solicitante(), fecha: this.fecha(),
    };
    const obs = this.esEdicion() && this.id
      ? this.svc.update(this.id, payload)
      : this.svc.create(payload);

    obs.subscribe({
      next: () => {
        this.toast.success(this.esEdicion() ? 'Trámite actualizado' : 'Trámite creado exitosamente');
        this.router.navigate(['/tramites']);
      },
      error: err => {
        this.toast.error(`Error: ${err.error?.message ?? 'No se pudo guardar'}`);
        this.loading.set(false);
      },
    });
  }
}
