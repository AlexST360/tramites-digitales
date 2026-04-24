import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tramites')
export class Tramite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  tipo: string;

  @Column({ default: 'pendiente' })
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'rechazado';

  @Column()
  solicitante: string;

  @Column()
  fecha: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
