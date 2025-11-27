export declare class ReembolsoRequestDto {
    id_transaccion_original: string;
    referencia_reembolso: string;
    monto_a_reembolsar: number;
    razon_reembolso?: string;
}
export declare class ReembolsoResponseDto {
    referencia_reembolso: string;
    id_reembolso_banco: string;
    estado_solicitud: 'ACEPTADA' | 'RECHAZADA' | 'ERROR';
    monto_procesado: number;
    codigo_respuesta: string;
    mensaje_respuesta: string;
}
