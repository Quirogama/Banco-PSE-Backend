export declare class WebhookNotificationDto {
    referencia_transaccion: string;
    estado_transaccion: 'APROBADA' | 'RECHAZADA' | 'REEMBOLSADA';
    monto_transaccion: number;
    fecha_hora_pago: string;
    codigo_respuesta: string;
    metodo_pago: string;
}
export declare class RedirectResponseDto {
    referencia_transaccion: string;
    estado_transaccion: 'APROBADA' | 'RECHAZADA' | 'PENDIENTE' | 'FALLIDA';
    codigo_autorizacion?: string;
}
