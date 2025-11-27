import { IsNumber, IsString, IsOptional } from 'class-validator';

export class ProcesarPagoDto {
  // Acepta ambos formatos
  @IsOptional()
  @IsNumber()
  pagoId?: number;

  @IsOptional()
  @IsNumber()
  id_pago?: number;
  
  // Acepta email o cedula
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  cedula_cliente?: string;
  
  @IsString()
  contrasena: string;
}
