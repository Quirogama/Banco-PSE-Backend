export declare class CreatePagoDto {
    monto_total: number;
    descripcion_pago: string;
    cedula_cliente: string;
    nombre_cliente: string;
    url_respuesta: string;
    url_notificacion: string;
    destinatario: string;
}
export declare class CreatePagoResponseDto {
    referencia_transaccion: string;
    url_banco: string;
}
