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
exports.Correo = void 0;
const typeorm_1 = require("typeorm");
const pago_entity_1 = require("./pago.entity");
let Correo = class Correo {
    id;
    idPago;
    asunto;
    cuerpo;
    pago;
};
exports.Correo = Correo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Correo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_pago' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Correo.prototype, "idPago", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], Correo.prototype, "asunto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Correo.prototype, "cuerpo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pago_entity_1.Pago, (pago) => pago.correos),
    (0, typeorm_1.JoinColumn)({ name: 'id_pago' }),
    __metadata("design:type", Object)
], Correo.prototype, "pago", void 0);
exports.Correo = Correo = __decorate([
    (0, typeorm_1.Entity)('correo')
], Correo);
//# sourceMappingURL=correo.entity.js.map