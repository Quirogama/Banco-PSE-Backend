"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pago = void 0;
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("../auth/usuario.entity");
let Pago = class Pago {
    id;
    idUsuario;
    fecha;
    monto;
    estado;
    referenciaTransaccion;
    descripcionPago;
    cedulaCliente;
    nombreCliente;
    urlRespuesta;
    urlNotificacion;
    destinatario;
    codigoAutorizacion;
    usuario;
    correos;
};
exports.Pago = Pago;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pago.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_usuario' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Pago.prototype, "idUsuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Pago.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Pago.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 50 }),
    __metadata("design:type", String)
], Pago.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referencia_transaccion', nullable: true, length: 100 }),
    __metadata("design:type", String)
], Pago.prototype, "referenciaTransaccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'descripcion_pago', nullable: true, length: 255 }),
    __metadata("design:type", String)
], Pago.prototype, "descripcionPago", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cedula_cliente', nullable: true, length: 50 }),
    __metadata("design:type", String)
], Pago.prototype, "cedulaCliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre_cliente', nullable: true, length: 100 }),
    __metadata("design:type", String)
], Pago.prototype, "nombreCliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'url_respuesta', nullable: true, length: 500 }),
    __metadata("design:type", String)
], Pago.prototype, "urlRespuesta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'url_notificacion', nullable: true, length: 500 }),
    __metadata("design:type", String)
], Pago.prototype, "urlNotificacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 50 }),
    __metadata("design:type", String)
], Pago.prototype, "destinatario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'codigo_autorizacion', nullable: true, length: 50 }),
    __metadata("design:type", String)
], Pago.prototype, "codigoAutorizacion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, (usuario) => usuario.pagos),
    (0, typeorm_1.JoinColumn)({ name: 'id_usuario' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], Pago.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Correo', 'pago'),
    __metadata("design:type", Array)
], Pago.prototype, "correos", void 0);
exports.Pago = Pago = __decorate([
    (0, typeorm_1.Entity)('pago')
], Pago);
//# sourceMappingURL=pago.entity.js.map