import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { ProcesarPagoDto } from './dto/procesar-pago.dto';
import { ReembolsoRequestDto } from './dto/reembolso.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';

@Controller()
export class PagosController {
  constructor(private pagosService: PagosService) {}

  // =====================================================
  // PÁGINA WEB DEL BANCO - Donde el usuario paga
  // =====================================================

  /**
   * Página de pago del banco - El usuario ve el monto e ingresa sus credenciales
   * GET /pago/:id
   */
  @Get('pago/:id')
  async mostrarPaginaPago(
    @Param('id') id: string,
    @Query('ref') ref: string,
    @Res() res: Response,
  ) {
    try {
      const pago = await this.pagosService.obtenerPago(parseInt(id, 10));
      
      if (!pago) {
        return res.status(HttpStatus.NOT_FOUND).send(`
          <!DOCTYPE html>
          <html><head><title>Pago no encontrado</title></head>
          <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h1>❌ Pago no encontrado</h1>
            <p>La referencia ${ref || id} no existe.</p>
          </body></html>
        `);
      }

      // Página de pago del banco
      const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Banco PSE - Pago Seguro</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Arial, sans-serif; 
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      max-width: 450px;
      width: 100%;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #0f4c75 0%, #3282b8 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 { font-size: 24px; margin-bottom: 5px; }
    .header .bank-logo { font-size: 40px; margin-bottom: 10px; }
    .content { padding: 30px; }
    .amount-box {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      margin-bottom: 25px;
      border: 2px solid #e9ecef;
    }
    .amount-label { color: #6c757d; font-size: 14px; margin-bottom: 5px; }
    .amount { font-size: 32px; font-weight: bold; color: #0f4c75; }
    .description { color: #495057; font-size: 14px; margin-top: 10px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { 
      display: block; 
      margin-bottom: 8px; 
      font-weight: 600;
      color: #333;
    }
    .form-group input {
      width: 100%;
      padding: 14px;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s;
    }
    .form-group input:focus {
      outline: none;
      border-color: #3282b8;
    }
    .btn {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #0f4c75 0%, #3282b8 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(15,76,117,0.4); }
    .btn:disabled { background: #ccc; cursor: not-allowed; transform: none; }
    .security-note {
      text-align: center;
      margin-top: 20px;
      color: #6c757d;
      font-size: 12px;
    }
    .error { 
      background: #f8d7da; 
      color: #721c24; 
      padding: 12px; 
      border-radius: 8px; 
      margin-bottom: 20px;
      display: none;
    }
    .success { 
      background: #d4edda; 
      color: #155724; 
      padding: 12px; 
      border-radius: 8px; 
      margin-bottom: 20px;
      display: none;
    }
    .test-users {
      background: #fff3cd;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 12px;
    }
    .test-users h4 { margin-bottom: 8px; color: #856404; }
    .test-users code { background: #ffc107; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="bank-logo">🏦</div>
      <h1>Banco PSE</h1>
      <p>Pago Seguro en Línea</p>
    </div>
    <div class="content">
      <div class="amount-box">
        <div class="amount-label">Monto a pagar</div>
        <div class="amount">$${pago.monto?.toLocaleString('es-CO') || '0'} COP</div>
        <div class="description">${pago.descripcionPago || 'Pago de servicio'}</div>
      </div>

      <div class="test-users">
        <h4>🧪 Usuarios de prueba:</h4>
        <p>🪪 Doc: <code>1234567890</code> / Pass: <code>cliente123</code> (Juan - $5M)</p>
        <p>🪪 Doc: <code>9876543210</code> / Pass: <code>cliente123</code> (María - $3M)</p>
        <p>🪪 Doc: <code>0000000000</code> / Pass: <code>cliente123</code> (Guest - $10M)</p>
      </div>

      <div class="error" id="error"></div>
      <div class="success" id="success"></div>

      <form id="pagoForm">
        <div class="form-group">
          <label for="cedula">📋 Email o Número de Cédula</label>
          <input type="text" id="cedula" name="cedula" placeholder="Ej: richiegut30@gmail.com o 1234567890" required>
        </div>
        <div class="form-group">
          <label for="contrasena">🔒 Contraseña</label>
          <input type="password" id="contrasena" name="contrasena" placeholder="Ingrese su contraseña" required>
        </div>
        <button type="submit" class="btn" id="btnPagar">
          💳 Autorizar Pago
        </button>
      </form>

      <div class="security-note">
        🔐 Conexión segura • Ref: ${ref || pago.referenciaTransaccion || 'N/A'}
      </div>
    </div>
  </div>

  <script>
    const form = document.getElementById('pagoForm');
    const btnPagar = document.getElementById('btnPagar');
    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      btnPagar.disabled = true;
      btnPagar.textContent = '⏳ Procesando...';
      errorDiv.style.display = 'none';
      successDiv.style.display = 'none';

      const cedula = document.getElementById('cedula').value;
      const contrasena = document.getElementById('contrasena').value;

      try {
        const response = await fetch('/api/pagos/procesar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_pago: ${id},
            cedula_cliente: cedula,
            contrasena: contrasena
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          successDiv.textContent = '✅ ' + (data.message || 'Pago aprobado');
          successDiv.style.display = 'block';
          btnPagar.textContent = '✅ Pago Exitoso';
          
          // Redirigir a la URL de respuesta después de 2 segundos
          setTimeout(() => {
            const returnUrl = data.url_respuesta || '${pago.urlRespuesta || ''}';
            if (returnUrl) {
              const separator = returnUrl.includes('?') ? '&' : '?';
              window.location.href = returnUrl + separator + 
                'referencia_transaccion=' + encodeURIComponent(data.referencia_transaccion || '${ref}') +
                '&estado_transaccion=' + encodeURIComponent(data.estado_transaccion || 'APROBADA') +
                '&codigo_autorizacion=' + encodeURIComponent(data.codigo_autorizacion || '');
            }
          }, 2000);
        } else {
          throw new Error(data.message || 'Error al procesar el pago');
        }
      } catch (err) {
        errorDiv.textContent = '❌ ' + (err.message || 'Error de conexión');
        errorDiv.style.display = 'block';
        btnPagar.disabled = false;
        btnPagar.textContent = '💳 Autorizar Pago';
      }
    });
  </script>
</body>
</html>
      `;

      res.type('text/html').send(html);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(`
        <!DOCTYPE html>
        <html><head><title>Error</title></head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1>❌ Error</h1>
          <p>${error.message || 'Error interno del servidor'}</p>
        </body></html>
      `);
    }
  }

  // =====================================================
  // ENDPOINTS SEGÚN DOCUMENTO OFICIAL DE INTEGRACIÓN
  // =====================================================

  /**
   * Crear pago - Endpoint principal para el sistema de Turismo
   * POST /crear-pago (alias: /api/pagos/crear)
   * 
   * Request: monto_total, descripcion_pago, cedula_cliente, nombre_cliente,
   *          url_respuesta, url_notificacion, destinatario
   * Response: referencia_transaccion, url_banco
   */
  @Post('crear-pago')
  async crearPago(@Body() createPagoDto: CreatePagoDto) {
    return this.pagosService.crearPagoOficial(createPagoDto);
  }

  // Alias para compatibilidad con integration tests
  @Post('api/pagos/crear')
  async crearPagoAlias(@Body() createPagoDto: CreatePagoDto) {
    return this.pagosService.crearPagoOficial(createPagoDto);
  }

  /**
   * Consultar estado de pago
   * GET /pagos/estado
   * Query params: id_transaccion o id_pago
   */
  @Get('pagos/estado')
  async consultarEstado(
    @Query('id_transaccion') idTransaccion?: string,
    @Query('id_pago') idPago?: string,
  ) {
    return this.pagosService.consultarEstado(idTransaccion, idPago);
  }

  /**
   * Solicitar reembolso
   * POST /pagos/reembolso
   */
  @Post('pagos/reembolso')
  async solicitarReembolso(@Body() reembolsoDto: ReembolsoRequestDto) {
    return this.pagosService.solicitarReembolso(reembolsoDto);
  }

  /**
   * Validar comprobante
   * POST /pagos/comprobante/validar
   */
  @Post('pagos/comprobante/validar')
  async validarComprobante(
    @Body() body: { id_transaccion: string; monto_esperado: number },
  ) {
    return this.pagosService.validarComprobante(body.id_transaccion, body.monto_esperado);
  }

  // =====================================================
  // ENDPOINTS INTERNOS DEL BANCO (para el frontend del banco)
  // =====================================================

  /**
   * Procesar el pago - Usuario se autentica en el banco
   * POST /api/pagos/procesar
   */
  @Post('api/pagos/procesar')
  async procesarPago(@Body() procesarPagoDto: ProcesarPagoDto) {
    return this.pagosService.procesarPago(procesarPagoDto);
  }

  /**
   * Listar pagos (admin)
   * GET /api/pagos
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Get('api/pagos')
  async listarPagos(@Query() query: any) {
    return this.pagosService.listarPagos(query);
  }

  /**
   * Obtener un pago específico
   * GET /api/pagos/:id
   */
  @Get('api/pagos/:id')
  async obtenerPago(@Param('id') id: string) {
    return this.pagosService.obtenerPago(parseInt(id, 10));
  }

  /**
   * Mis pagos (usuario autenticado)
   * GET /api/pagos/usuario/mis-pagos
   */
  @UseGuards(JwtAuthGuard)
  @Get('api/pagos/usuario/mis-pagos')
  async obtenerMisPagos(@Request() req: any) {
    return this.pagosService.obtenerPagosUsuario(req.user.userId as number);
  }

  /**
   * Cancelar pago (admin)
   * POST /api/pagos/:id/cancel
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Post('api/pagos/:id/cancel')
  async cancelarPago(@Param('id') id: string) {
    return this.pagosService.cancelarPago(parseInt(id, 10));
  }
}
