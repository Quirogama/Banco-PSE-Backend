"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedirectResponseDto = exports.WebhookNotificationDto = void 0;
class WebhookNotificationDto {
    referencia_transaccion;
    estado_transaccion;
    monto_transaccion;
    fecha_hora_pago;
    codigo_respuesta;
    metodo_pago;
}
exports.WebhookNotificationDto = WebhookNotificationDto;
class RedirectResponseDto {
    referencia_transaccion;
    estado_transaccion;
    codigo_autorizacion;
}
exports.RedirectResponseDto = RedirectResponseDto;
//# sourceMappingURL=webhook-notification.dto.js.map