import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn, IsDateString } from 'class-validator';

const ESTADOS = ['pendiente', 'en_proceso', 'completado', 'rechazado'] as const;
const TIPOS = ['Certificado', 'Permiso', 'Licencia', 'Registro', 'Otro'] as const;

export class CreateTramiteDto {
  @ApiProperty({ example: 'Certificado de residencia' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ enum: TIPOS, example: 'Certificado' })
  @IsIn(TIPOS)
  tipo: string;

  @ApiProperty({ enum: ESTADOS, example: 'pendiente' })
  @IsIn(ESTADOS)
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'rechazado';

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  solicitante: string;

  @ApiProperty({ example: '2026-04-23' })
  @IsDateString()
  fecha: string;
}
