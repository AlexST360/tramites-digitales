import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tramite {
  id?: number;
  titulo: string;
  tipo: string;
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'rechazado';
  solicitante: string;
  fecha: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TramitePage {
  data: Tramite[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TramiteStats {
  total: number;
  pendiente: number;
  en_proceso: number;
  completado: number;
  rechazado: number;
}

export interface TramiteFiltros {
  estado?: string;
  tipo?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class TramitesService {
  private api = 'http://localhost:3000/api/tramites';

  constructor(private http: HttpClient) {}

  getAll(filtros?: TramiteFiltros): Observable<TramitePage> {
    let params = new HttpParams();
    if (filtros?.estado)     params = params.set('estado', filtros.estado);
    if (filtros?.tipo)       params = params.set('tipo', filtros.tipo);
    if (filtros?.fechaDesde) params = params.set('fechaDesde', filtros.fechaDesde);
    if (filtros?.fechaHasta) params = params.set('fechaHasta', filtros.fechaHasta);
    if (filtros?.page)       params = params.set('page', filtros.page);
    if (filtros?.limit)      params = params.set('limit', filtros.limit ?? 10);
    return this.http.get<TramitePage>(this.api, { params });
  }

  getOne(id: number): Observable<Tramite> {
    return this.http.get<Tramite>(`${this.api}/${id}`);
  }

  getStats(): Observable<TramiteStats> {
    return this.http.get<TramiteStats>(`${this.api}/stats`);
  }

  create(t: Tramite): Observable<Tramite> {
    return this.http.post<Tramite>(this.api, t);
  }

  update(id: number, t: Partial<Tramite>): Observable<Tramite> {
    return this.http.patch<Tramite>(`${this.api}/${id}`, t);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
