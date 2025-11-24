import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Correo } from '../pagos/correo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Correo)
    private correoRepository: Repository<Correo>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST') || 'smtp.gmail.com',
      port: parseInt(this.configService.get('MAIL_PORT') || '587', 10),
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async enviarConfirmacionPago(
    destinatario: string,
    nombreUsuario: string,
    monto: number,
    fechaPago: Date,
    pagoId: number,
  ) {
    const asunto = 'Confirmación de Pago - Banco Javeriano';
    const cuerpo = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .details { background-color: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          .amount { font-size: 24px; font-weight: bold; color: #28a745; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Banco Javeriano</h1>
            <p>Confirmación de Pago</p>
          </div>
          <div class="content">
            <p>Estimado/a ${nombreUsuario},</p>
            <p>Su pago ha sido procesado exitosamente.</p>
            
            <div class="details">
              <h3>Detalles del Pago:</h3>
              <p><strong>ID de Transacción:</strong> #${pagoId}</p>
              <p><strong>Fecha:</strong> ${fechaPago.toLocaleString('es-ES')}</p>
                <p><strong>Monto:</strong> <span style="color:#28a745;font-size:16px;font-weight:bold;">$${Number(monto).toFixed(2)}</span></p>
                <p><strong>Estado:</strong> Pagado</p>
            </div>
            
            <p>Gracias por utilizar nuestros servicios.</p>
            <p>Este pago corresponde a su reserva turística y ha sido acreditado correctamente.</p>
          </div>
          <div class="footer">
            <p>Este es un correo automático, por favor no responder.</p>
            <p>&copy; ${new Date().getFullYear()} Banco Javeriano - Todos los derechos reservados</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      // Enviar correo
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const info = await this.transporter.sendMail({
        from:
          this.configService.get('MAIL_FROM') ||
          '"Banco Javeriano" <bancojaveriano@gmail.com>',
        to: destinatario,
        subject: asunto,
        html: cuerpo,
      });

      // Guardar registro del correo en la base de datos
      const correoEntity = this.correoRepository.create({
        idPago: pagoId,
        asunto,
        cuerpo,
      });

      await this.correoRepository.save(correoEntity);

      return {
        success: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        messageId: info.messageId as string,
      };
    } catch (error) {
      console.error('Error al enviar correo:', error);
      throw error;
    }
  }
}
