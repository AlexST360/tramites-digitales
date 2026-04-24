import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, FindOptionsWhere } from 'typeorm';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { Tramite } from './entities/tramite.entity';

@Injectable()
export class TramitesService implements OnModuleInit {
  constructor(
    @InjectRepository(Tramite)
    private repo: Repository<Tramite>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) {
      await this.repo.save([
        { titulo: 'Certificado de residencia', tipo: 'Certificado', estado: 'pendiente', solicitante: 'Juan Pérez', fecha: '2026-04-01' },
        { titulo: 'Permiso de circulación', tipo: 'Permiso', estado: 'en_proceso', solicitante: 'María López', fecha: '2026-04-05' },
        { titulo: 'Licencia de obras', tipo: 'Licencia', estado: 'completado', solicitante: 'Carlos Ruiz', fecha: '2026-03-20' },
        { titulo: 'Registro de negocio', tipo: 'Registro', estado: 'rechazado', solicitante: 'Ana García', fecha: '2026-03-15' },
        { titulo: 'Permiso de construcción', tipo: 'Permiso', estado: 'pendiente', solicitante: 'Luis Torres', fecha: '2026-04-10' },
        { titulo: 'Certificado de matrimonio', tipo: 'Certificado', estado: 'completado', solicitante: 'Laura Díaz', fecha: '2026-04-12' },
      ]);
    }
  }

  async findAll(filters?: {
    estado?: string;
    tipo?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    page?: number;
    limit?: number;
  }) {
    const where: FindOptionsWhere<Tramite> = {};
    if (filters?.estado) where.estado = filters.estado as any;
    if (filters?.tipo) where.tipo = filters.tipo;

    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;

    let qb = this.repo.createQueryBuilder('t');
    if (filters?.estado) qb = qb.andWhere('t.estado = :estado', { estado: filters.estado });
    if (filters?.tipo) qb = qb.andWhere('t.tipo = :tipo', { tipo: filters.tipo });
    if (filters?.fechaDesde) qb = qb.andWhere('t.fecha >= :desde', { desde: filters.fechaDesde });
    if (filters?.fechaHasta) qb = qb.andWhere('t.fecha <= :hasta', { hasta: filters.fechaHasta });

    const total = await qb.getCount();
    const data = await qb
      .orderBy('t.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number): Promise<Tramite> {
    const t = await this.repo.findOneBy({ id });
    if (!t) throw new NotFoundException(`Trámite #${id} no encontrado`);
    return t;
  }

  async create(dto: CreateTramiteDto): Promise<Tramite> {
    const t = this.repo.create(dto);
    return this.repo.save(t);
  }

  async update(id: number, dto: UpdateTramiteDto): Promise<Tramite> {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }

  async getStats() {
    const rows = await this.repo
      .createQueryBuilder('t')
      .select('t.estado', 'estado')
      .addSelect('COUNT(*)', 'count')
      .groupBy('t.estado')
      .getRawMany();

    const stats = { total: 0, pendiente: 0, en_proceso: 0, completado: 0, rechazado: 0 };
    for (const r of rows) {
      const n = Number(r.count);
      stats[r.estado as keyof typeof stats] = n;
      stats.total += n;
    }
    return stats;
  }
}
