import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { ProcesarPagoDto } from './dto/procesar-pago.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller('pagos')
export class PagosController {
  constructor(private pagosService: PagosService) {}

  // Endpoint para crear un pago desde el sistema de turismo (sin autenticación)
  @Post('crear')
  async crearPago(@Body() createPagoDto: CreatePagoDto, @Res() res: Response) {
    // Espera: { monto, tipoDocumento, identificacion }
    const pago = await this.pagosService.crearPago(createPagoDto);
    // Redirigir al usuario a la pantalla de pago en el frontend
    return res.redirect(302, `http://localhost:3001/pago/${pago.pagoId}`);
  }

  // Endpoint para procesar el pago (autenticación en el banco)
  @Post('procesar')
  async procesarPago(
    @Body() procesarPagoDto: ProcesarPagoDto,
    @Res() res: Response,
  ) {
    const resultado = await this.pagosService.procesarPago(procesarPagoDto);
    // Obtener el pago completo para enviar los datos
    const pago = await this.pagosService.obtenerPago(resultado.pagoId);
    // Construir los query params con los datos completos
    const params = new URLSearchParams({
      id: String(pago.id),
      idUsuario: String(pago.idUsuario),
      fecha: pago.fecha.toISOString(),
      monto: String(pago.monto),
      estado: pago.estado,
      tipoDocumento: pago.usuario?.tipoDocumento ?? '',
      nombre: pago.usuario?.nombre ?? '',
      apellido: pago.usuario?.apellido ?? '',
      email: pago.usuario?.email ?? '',
      telefono: pago.usuario?.telefono ?? '',
      ocupacion: pago.usuario?.ocupacion ?? '',
      rol: pago.usuario?.rol ?? '',
      balance: String(pago.usuario?.balance ?? ''),
    });
    // Redirigir a la solución de turismo con los datos completos
    return res.redirect(
      302,
      `http://localhost:3002/solucion-turismo?${params.toString()}`,
    );
  }

  // Obtener información de un pago específico
  @Get(':id')
  async obtenerPago(@Param('id') id: string) {
    return this.pagosService.obtenerPago(parseInt(id, 10));
  }

  // Obtener todos los pagos del usuario autenticado
  @UseGuards(JwtAuthGuard)
  @Get('usuario/mis-pagos')
  async obtenerMisPagos(@Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.pagosService.obtenerPagosUsuario(req.user.userId as number);
  }
}
