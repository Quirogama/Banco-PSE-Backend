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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagosController = void 0;
const common_1 = require("@nestjs/common");
const pagos_service_1 = require("./pagos.service");
const create_pago_dto_1 = require("./dto/create-pago.dto");
const procesar_pago_dto_1 = require("./dto/procesar-pago.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const common_2 = require("@nestjs/common");
let PagosController = class PagosController {
    pagosService;
    constructor(pagosService) {
        this.pagosService = pagosService;
    }
    async crearPago(createPagoDto, res) {
        const pago = await this.pagosService.crearPago(createPagoDto);
        return res.redirect(302, `http://localhost:3001/pago/${pago.pagoId}`);
    }
    async procesarPago(procesarPagoDto, res) {
        const resultado = await this.pagosService.procesarPago(procesarPagoDto);
        const pago = await this.pagosService.obtenerPago(resultado.pagoId);
        const params = new URLSearchParams({
            id: String(pago.id),
            idUsuario: String(pago.idUsuario),
            fecha: new Date(pago.fecha).toISOString(),
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
        return res.redirect(302, `http://localhost:3002/solucion-turismo?${params.toString()}`);
    }
    async obtenerPago(id) {
        return this.pagosService.obtenerPago(parseInt(id, 10));
    }
    async obtenerMisPagos(req) {
        return this.pagosService.obtenerPagosUsuario(req.user.userId);
    }
};
exports.PagosController = PagosController;
__decorate([
    (0, common_1.Post)('crear'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_2.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pago_dto_1.CreatePagoDto, Object]),
    __metadata("design:returntype", Promise)
], PagosController.prototype, "crearPago", null);
__decorate([
    (0, common_1.Post)('procesar'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_2.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [procesar_pago_dto_1.ProcesarPagoDto, Object]),
    __metadata("design:returntype", Promise)
], PagosController.prototype, "procesarPago", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PagosController.prototype, "obtenerPago", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('usuario/mis-pagos'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PagosController.prototype, "obtenerMisPagos", null);
exports.PagosController = PagosController = __decorate([
    (0, common_1.Controller)('pagos'),
    __metadata("design:paramtypes", [pagos_service_1.PagosService])
], PagosController);
//# sourceMappingURL=pagos.controller.js.map