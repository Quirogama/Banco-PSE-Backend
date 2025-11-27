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
exports.PagosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const pago_entity_1 = require("./pago.entity");
const usuario_entity_1 = require("../auth/usuario.entity");
const mail_service_1 = require("../common/mail.service");
let PagosService = class PagosService {
    pagoRepository;
    usuarioRepository;
    mailService;
    constructor(pagoRepository, usuarioRepository, mailService) {
        this.pagoRepository = pagoRepository;
        this.usuarioRepository = usuarioRepository;
        this.mailService = mailService;
    }
    async crearPagoOficial(dto) {
        let usuario = await this.usuarioRepository.findOne({
            where: { documento: dto.cedula_cliente },
        });
        if (!usuario && !isNaN(Number(dto.cedula_cliente))) {
            usuario = await this.usuarioRepository.findOne({
                where: { id: Number(dto.cedula_cliente) },
            });
        }
        if (!usuario) {
            usuario = await this.usuarioRepository.findOne({
                where: { email: 'guest@banco.com' },
            });
            if (!usuario) {
                usuario = await this.usuarioRepository.findOne({
                    where: { rol: 'cliente' },
                });
            }
        }
        if (!usuario) {
            throw new common_1.NotFoundException('Usuario no encontrado en el sistema bancario. Debe registrarse primero.');
        }
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
        const referenciaTransaccion = `BDB-${dateStr}-${suffix}`;
        const pago = this.pagoRepository.create({
            idUsuario: usuario.id,
            monto: dto.monto_total,
            fecha: now,
            estado: 'pendiente',
            referenciaTransaccion: referenciaTransaccion,
            descripcionPago: dto.descripcion_pago,
            cedulaCliente: dto.cedula_cliente,
            nombreCliente: dto.nombre_cliente,
            urlRespuesta: dto.url_respuesta,
            urlNotificacion: dto.url_notificacion,
            destinatario: dto.destinatario,
        });
        const pagoGuardado = await this.pagoRepository.save(pago);
        const baseUrl = process.env.BANK_PUBLIC_URL || 'http://localhost:3000';
        const urlBanco = `${baseUrl}/pago/${pagoGuardado.id}?ref=${referenciaTransaccion}`;
        return {
            referencia_transaccion: referenciaTransaccion,
            url_banco: urlBanco,
        };
    }
    async consultarEstado(idTransaccion, idPago) {
        let pago = null;
        if (idTransaccion) {
            pago = await this.pagoRepository.findOne({
                where: { referenciaTransaccion: idTransaccion },
            });
        }
        if (!pago && idPago) {
            pago = await this.pagoRepository.findOne({
                where: { id: parseInt(idPago, 10) },
            });
        }
        if (!pago) {
            throw new common_1.NotFoundException('Transacción no encontrada');
        }
        let estadoDoc = 'PENDIENTE';
        if (pago.estado === 'exitoso')
            estadoDoc = 'APROBADA';
        else if (pago.estado === 'fallido')
            estadoDoc = 'DENEGADA';
        else if (pago.estado === 'cancelado')
            estadoDoc = 'CANCELADA';
        let fechaActualizacion;
        if (pago.fecha instanceof Date) {
            fechaActualizacion = pago.fecha.toISOString();
        }
        else if (pago.fecha) {
            fechaActualizacion = new Date(pago.fecha).toISOString();
        }
        else {
            fechaActualizacion = new Date().toISOString();
        }
        return {
            estado: estadoDoc,
            detalle: `Estado del pago: ${pago.estado}`,
            monto: pago.monto,
            moneda: 'COP',
            codigo_autorizacion: pago.codigoAutorizacion || null,
            comprobante: pago.estado === 'exitoso' ? `COMP-${pago.id}` : null,
            fecha_actualizacion: fechaActualizacion,
        };
    }
    async solicitarReembolso(dto) {
        const pago = await this.pagoRepository.findOne({
            where: { referenciaTransaccion: dto.id_transaccion_original },
        });
        if (!pago) {
            return {
                referencia_reembolso: dto.referencia_reembolso,
                id_reembolso_banco: null,
                estado_solicitud: 'RECHAZADA',
                monto_procesado: 0,
                codigo_respuesta: '55',
                mensaje_respuesta: 'Transacción original no encontrada',
            };
        }
        if (pago.estado !== 'exitoso') {
            return {
                referencia_reembolso: dto.referencia_reembolso,
                id_reembolso_banco: null,
                estado_solicitud: 'RECHAZADA',
                monto_procesado: 0,
                codigo_respuesta: '54',
                mensaje_respuesta: 'La transacción no está en estado exitoso',
            };
        }
        if (dto.monto_a_reembolsar > Number(pago.monto)) {
            return {
                referencia_reembolso: dto.referencia_reembolso,
                id_reembolso_banco: null,
                estado_solicitud: 'RECHAZADA',
                monto_procesado: 0,
                codigo_respuesta: '56',
                mensaje_respuesta: 'Monto de reembolso excede el monto original',
            };
        }
        const idReembolso = `REF-${Date.now()}`;
        const usuario = await this.usuarioRepository.findOne({
            where: { id: pago.idUsuario },
        });
        const turismo = await this.usuarioRepository.findOne({
            where: { email: 'solucion.turismo@sistema.com' },
        });
        if (usuario && turismo) {
            usuario.balance = Number(usuario.balance) + Number(dto.monto_a_reembolsar);
            turismo.balance = Number(turismo.balance) - Number(dto.monto_a_reembolsar);
            await this.usuarioRepository.save([usuario, turismo]);
            console.log(`[REEMBOLSO] Devuelto $${dto.monto_a_reembolsar} a usuario ${usuario.id}`);
        }
        else {
            console.warn('[REEMBOLSO] No se pudo realizar el movimiento de fondos - usuarios no encontrados');
        }
        pago.estado = 'reembolsado';
        await this.pagoRepository.save(pago);
        return {
            referencia_reembolso: dto.referencia_reembolso,
            id_reembolso_banco: idReembolso,
            estado_solicitud: 'ACEPTADA',
            monto_procesado: dto.monto_a_reembolsar,
            codigo_respuesta: '00',
            mensaje_respuesta: 'Solicitud de reembolso aceptada',
        };
    }
    async validarComprobante(idTransaccion, montoEsperado) {
        const pago = await this.pagoRepository.findOne({
            where: { referenciaTransaccion: idTransaccion },
        });
        if (!pago) {
            return { valido: 'NO', detalle: 'Transacción no encontrada' };
        }
        if (pago.estado !== 'exitoso') {
            return { valido: 'NO', detalle: 'Transacción no está aprobada' };
        }
        const montoCoincide = Number(pago.monto) === montoEsperado;
        return {
            valido: montoCoincide ? 'SI' : 'NO',
            detalle: montoCoincide ? 'Comprobante válido' : 'Monto no coincide',
        };
    }
    async enviarWebhook(pago, estado) {
        if (!pago.urlNotificacion) {
            console.log('[WEBHOOK] No hay URL de notificación configurada');
            return;
        }
        const payload = {
            referencia_transaccion: pago.referenciaTransaccion,
            estado_transaccion: estado,
            monto_transaccion: pago.monto,
            fecha_hora_pago: new Date().toISOString(),
            codigo_respuesta: estado === 'APROBADA' ? '00' : '51',
            metodo_pago: 'CUENTA_BANCARIA',
        };
        console.log(`[WEBHOOK] Enviando notificación a ${pago.urlNotificacion}`);
        try {
            const response = await fetch(pago.urlNotificacion, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                console.log('[WEBHOOK] Notificación enviada exitosamente');
            }
            else {
                console.error(`[WEBHOOK] Error: ${response.status} ${response.statusText}`);
            }
        }
        catch (error) {
            console.error('[WEBHOOK] Error enviando notificación:', error);
        }
    }
    async procesarPago(procesarPagoDto) {
        const pagoId = procesarPagoDto.pagoId || procesarPagoDto.id_pago;
        if (!pagoId || isNaN(Number(pagoId))) {
            throw new common_1.BadRequestException('El pagoId es inválido');
        }
        const pago = await this.pagoRepository.findOne({
            where: { id: Number(pagoId) },
            relations: ['usuario'],
        });
        if (!pago) {
            throw new common_1.NotFoundException('Pago no encontrado');
        }
        if (pago.estado === 'exitoso') {
            throw new common_1.BadRequestException('Este pago ya ha sido procesado');
        }
        const identificador = procesarPagoDto.email || procesarPagoDto.cedula_cliente;
        let usuario = await this.usuarioRepository.findOne({
            where: { email: identificador },
        });
        if (!usuario && procesarPagoDto.cedula_cliente) {
            usuario = await this.usuarioRepository.findOne({
                where: { documento: procesarPagoDto.cedula_cliente },
            });
        }
        if (!usuario) {
            pago.estado = 'fallido';
            await this.pagoRepository.save(pago);
            await this.enviarWebhook(pago, 'RECHAZADA');
            throw new common_1.BadRequestException('Credenciales inválidas');
        }
        const isPasswordValid = await bcrypt.compare(procesarPagoDto.contrasena, usuario.contrasena);
        if (!isPasswordValid) {
            pago.estado = 'fallido';
            await this.pagoRepository.save(pago);
            await this.enviarWebhook(pago, 'RECHAZADA');
            throw new common_1.BadRequestException('Credenciales inválidas');
        }
        if (Number(usuario.balance) < Number(pago.monto)) {
            pago.estado = 'fallido';
            await this.pagoRepository.save(pago);
            await this.enviarWebhook(pago, 'RECHAZADA');
            throw new common_1.BadRequestException('Saldo insuficiente');
        }
        const usuarioDestino = await this.usuarioRepository.findOne({
            where: { email: 'solucion.turismo@sistema.com' },
        });
        if (!usuarioDestino) {
            pago.estado = 'fallido';
            await this.pagoRepository.save(pago);
            await this.enviarWebhook(pago, 'RECHAZADA');
            throw new common_1.NotFoundException('Usuario destino no encontrado');
        }
        usuario.balance = Number(usuario.balance) - Number(pago.monto);
        usuarioDestino.balance = Number(usuarioDestino.balance) + Number(pago.monto);
        const codigoAutorizacion = `AUTH-${Date.now()}`;
        pago.estado = 'exitoso';
        pago.fecha = new Date();
        pago.codigoAutorizacion = codigoAutorizacion;
        await this.usuarioRepository.save([usuario, usuarioDestino]);
        await this.pagoRepository.save(pago);
        await this.enviarWebhook(pago, 'APROBADA');
        try {
            await this.mailService.enviarConfirmacionPago(usuario.email, `${usuario.nombre} ${usuario.apellido}`, pago.monto, pago.fecha, pago.id);
        }
        catch (error) {
            console.error('Error al enviar correo:', error);
        }
        return {
            success: true,
            message: 'Pago procesado exitosamente',
            pagoId: pago.id,
            nuevoBalance: usuario.balance,
            referencia_transaccion: pago.referenciaTransaccion,
            estado_transaccion: 'APROBADA',
            codigo_autorizacion: codigoAutorizacion,
            url_respuesta: pago.urlRespuesta,
        };
    }
    async cancelarPago(pagoId) {
        const pago = await this.pagoRepository.findOne({ where: { id: pagoId } });
        if (!pago) {
            throw new common_1.NotFoundException('Pago no encontrado');
        }
        if (pago.estado === 'exitoso') {
            throw new common_1.BadRequestException('No se puede cancelar un pago exitoso');
        }
        pago.estado = 'cancelado';
        await this.pagoRepository.save(pago);
        return { success: true, message: 'Pago cancelado', pagoId: pago.id };
    }
    async obtenerPago(id) {
        const pago = await this.pagoRepository.findOne({
            where: { id },
            relations: ['usuario'],
        });
        if (!pago) {
            throw new common_1.NotFoundException('Pago no encontrado');
        }
        return pago;
    }
    async obtenerPagosUsuario(userId) {
        return this.pagoRepository.find({
            where: { idUsuario: userId },
            order: { fecha: 'DESC' },
        });
    }
    async listarPagos(query) {
        const page = Number(query.page) > 0 ? Number(query.page) : 1;
        const size = Number(query.size) > 0 ? Number(query.size) : 25;
        const skip = (page - 1) * size;
        const qb = this.pagoRepository.createQueryBuilder('pago');
        if (query.estado) {
            qb.andWhere('pago.estado = :estado', { estado: query.estado });
        }
        if (query.userId) {
            qb.andWhere('pago.id_usuario = :userId', { userId: query.userId });
        }
        if (query.from) {
            qb.andWhere('pago.fecha >= :from', { from: query.from });
        }
        if (query.to) {
            qb.andWhere('pago.fecha <= :to', { to: query.to });
        }
        const [data, total] = await qb
            .orderBy('pago.fecha', 'DESC')
            .skip(skip)
            .take(size)
            .getManyAndCount();
        return {
            data,
            total,
            page,
            size,
        };
    }
};
exports.PagosService = PagosService;
exports.PagosService = PagosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pago_entity_1.Pago)),
    __param(1, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        mail_service_1.MailService])
], PagosService);
//# sourceMappingURL=pagos.service.js.map