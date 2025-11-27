import axios from 'axios';
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { ProcesarPagoDto } from './dto/procesar-pago.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Response } from 'express';

@Controller('pagos')
export class PagosController {
  constructor(private pagosService: PagosService) {}

  // Endpoint para notificación de servidor a servidor
  @Post('notificar')
  async notificarPago(@Body() body: { pagoId: number }, @Res() res: Response) {
    const pago = await this.pagosService.obtenerPago(body.pagoId);
    if (!pago) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }
    // Construir datos de notificación
    const referencia_transaccion = String(pago.id);
    let estado_transaccion = 'RECHAZADA';
    if (pago.estado === 'exitoso') {
      estado_transaccion = 'APROBADA';
    } else if (pago.estado === 'pendiente') {
      estado_transaccion = 'PENDIENTE';
    } else if (pago.estado === 'fallido') {
      estado_transaccion = 'FALLIDA';
    }
    // Simular monto, fecha, código y método
    const monto_transaccion = pago.monto;
    const fecha_hora_pago = pago.fecha
      ? pago.fecha.toISOString()
      : new Date().toISOString();
    let codigo_respuesta = '00';
    if (estado_transaccion === 'FALLIDA') {
      codigo_respuesta = '51'; // Fondos insuficientes
    }
    // URL fija de notificación
    const urlNotificacion = 'http://localhost:3001/pago/notificacion';
    const datos = {
      referencia_transaccion,
      estado_transaccion,
      monto_transaccion,
      fecha_hora_pago,
      codigo_respuesta,
    };
    // Enviar POST a la URL fija
    try {
      await axios.post(urlNotificacion, datos, {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.json({ success: true, enviado: true, datos });
    } catch (error: unknown) {
      let errorMsg = '';
      if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMsg = (error as { message?: string }).message ?? '';
      } else {
        errorMsg = String(error);
      }
      return res.status(500).json({ success: false, error: errorMsg });
    }
  }

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
    const pago = await this.pagosService.obtenerPago(resultado.pagoId);
    // Construir los parámetros requeridos
    const referencia_transaccion = String(pago.id);
    let estado_transaccion = 'RECHAZADA';
    if (pago.estado === 'exitoso') {
      estado_transaccion = 'APROBADA';
    } else if (pago.estado === 'pendiente') {
      estado_transaccion = 'PENDIENTE';
    } else if (pago.estado === 'fallido') {
      estado_transaccion = 'FALLIDA';
    }
    let codigo_autorizacion = '';
    if (estado_transaccion === 'APROBADA') {
      codigo_autorizacion = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
    }
    // Redirigir a la URL fija con los parámetros
    const params = new URLSearchParams({
      referencia_transaccion,
      estado_transaccion,
      ...(codigo_autorizacion && { codigo_autorizacion }),
    });
    return res.redirect(
      302,
      `http://localhost:3001/pago/respuesta?${params.toString()}`,
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
