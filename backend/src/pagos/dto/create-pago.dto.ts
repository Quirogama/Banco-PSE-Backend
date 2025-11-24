export class CreatePagoDto {
  idUsuario: number;
  monto: number;
  descripcion?: string;
  // Datos del sistema de turismo
  referenciaTurismo?: string;
  nombreReserva?: string;
}
