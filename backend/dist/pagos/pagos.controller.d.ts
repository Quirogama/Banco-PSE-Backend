import type { Response } from 'express';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { ProcesarPagoDto } from './dto/procesar-pago.dto';
import { ReembolsoRequestDto } from './dto/reembolso.dto';
export declare class PagosController {
    private pagosService;
    constructor(pagosService: PagosService);
    mostrarPaginaPago(id: string, ref: string, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    crearPago(createPagoDto: CreatePagoDto): Promise<{
        referencia_transaccion: string;
        url_banco: string;
    }>;
    crearPagoAlias(createPagoDto: CreatePagoDto): Promise<{
        referencia_transaccion: string;
        url_banco: string;
    }>;
    consultarEstado(idTransaccion?: string, idPago?: string): Promise<{
        estado: string;
        detalle: string;
        monto: number;
        moneda: string;
        codigo_autorizacion: string | null;
        comprobante: string | null;
        fecha_actualizacion: string;
    }>;
    solicitarReembolso(reembolsoDto: ReembolsoRequestDto): Promise<{
        referencia_reembolso: string;
        id_reembolso_banco: null;
        estado_solicitud: string;
        monto_procesado: number;
        codigo_respuesta: string;
        mensaje_respuesta: string;
    } | {
        referencia_reembolso: string;
        id_reembolso_banco: string;
        estado_solicitud: string;
        monto_procesado: number;
        codigo_respuesta: string;
        mensaje_respuesta: string;
    }>;
    validarComprobante(body: {
        id_transaccion: string;
        monto_esperado: number;
    }): Promise<{
        valido: string;
        detalle: string;
    }>;
    procesarPago(procesarPagoDto: ProcesarPagoDto): Promise<{
        success: boolean;
        message: string;
        pagoId: number;
        nuevoBalance: number;
        referencia_transaccion: string;
        estado_transaccion: string;
        codigo_autorizacion: string;
        url_respuesta: string;
    }>;
    listarPagos(query: any): Promise<{
        data: import("./pago.entity").Pago[];
        total: number;
        page: number;
        size: number;
    }>;
    obtenerPago(id: string): Promise<import("./pago.entity").Pago>;
    obtenerMisPagos(req: any): Promise<import("./pago.entity").Pago[]>;
    cancelarPago(id: string): Promise<{
        success: boolean;
        message: string;
        pagoId: number;
    }>;
}
