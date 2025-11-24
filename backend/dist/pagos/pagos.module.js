"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const pagos_controller_1 = require("./pagos.controller");
const pagos_service_1 = require("./pagos.service");
const pago_entity_1 = require("./pago.entity");
const correo_entity_1 = require("./correo.entity");
const usuario_entity_1 = require("../auth/usuario.entity");
const mail_service_1 = require("../common/mail.service");
let PagosModule = class PagosModule {
};
exports.PagosModule = PagosModule;
exports.PagosModule = PagosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([pago_entity_1.Pago, correo_entity_1.Correo, usuario_entity_1.Usuario])],
        controllers: [pagos_controller_1.PagosController],
        providers: [pagos_service_1.PagosService, mail_service_1.MailService],
        exports: [typeorm_1.TypeOrmModule],
    })
], PagosModule);
//# sourceMappingURL=pagos.module.js.map