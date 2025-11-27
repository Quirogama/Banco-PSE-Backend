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
exports.CreatePagoResponseDto = exports.CreatePagoDto = void 0;
const class_validator_1 = require("class-validator");
class CreatePagoDto {
    monto_total;
    descripcion_pago;
    cedula_cliente;
    nombre_cliente;
    url_respuesta;
    url_notificacion;
    destinatario;
}
exports.CreatePagoDto = CreatePagoDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePagoDto.prototype, "monto_total", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePagoDto.prototype, "descripcion_pago", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePagoDto.prototype, "cedula_cliente", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePagoDto.prototype, "nombre_cliente", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({ require_tld: false }),
    __metadata("design:type", String)
], CreatePagoDto.prototype, "url_respuesta", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({ require_tld: false }),
    __metadata("design:type", String)
], CreatePagoDto.prototype, "url_notificacion", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePagoDto.prototype, "destinatario", void 0);
class CreatePagoResponseDto {
    referencia_transaccion;
    url_banco;
}
exports.CreatePagoResponseDto = CreatePagoResponseDto;
//# sourceMappingURL=create-pago.dto.js.map