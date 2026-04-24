import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { TramitesService } from '../../services/tramites';

@Component({
  selector: 'app-tramite-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './tramite-detail.html',
  styleUrl: './tramite-detail.scss',
})
export class TramiteDetail {
  private svc   = inject(TramitesService);
  private route = inject(ActivatedRoute);

  tramite = toSignal(
    this.route.paramMap.pipe(
      switchMap(p => this.svc.getOne(+p.get('id')!))
    )
  );

  private order = ['pendiente', 'en_proceso', 'completado'];
  isStepDone(current: string, step: string) {
    return this.order.indexOf(current) > this.order.indexOf(step);
  }

  badgeClass(estado: string) {
    return ({ pendiente: 'badge badge-pendiente', en_proceso: 'badge badge-proceso', completado: 'badge badge-completado', rechazado: 'badge badge-rechazado' }[estado] ?? 'badge');
  }
}
