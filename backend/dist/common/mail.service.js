"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
const correo_entity_1 = require("../pagos/correo.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let MailService = class MailService {
    configService;
    correoRepository;
    transporter;
    constructor(configService, correoRepository) {
        this.configService = configService;
        this.correoRepository = correoRepository;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('MAIL_HOST') || 'smtp.gmail.com',
            port: parseInt(this.configService.get('MAIL_PORT') || '587', 10),
            secure: false,
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASSWORD'),
            },
        });
    }
    async enviarConfirmacionPago(destinatario, nombreUsuario, monto, fechaPago, pagoId) {
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
            const info = await this.transporter.sendMail({
                from: this.configService.get('MAIL_FROM') ||
                    '"Banco Javeriano" <bancojaveriano@gmail.com>',
                to: destinatario,
                subject: asunto,
                html: cuerpo,
            });
            const correoEntity = this.correoRepository.create({
                idPago: pagoId,
                asunto,
                cuerpo,
            });
            await this.correoRepository.save(correoEntity);
            return {
                success: true,
                messageId: info.messageId,
            };
        }
        catch (error) {
            console.error('Error al enviar correo:', error);
            throw error;
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(correo_entity_1.Correo)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository])
], MailService);
//# sourceMappingURL=mail.service.js.map