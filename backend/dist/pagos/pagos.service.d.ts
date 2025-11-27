import { Repository } from 'typeorm';
import { Pago } from './pago.entity';
import { Usuario } from '../auth/usuario.entity';
import { CreatePagoDto } from './dto/create-pago.dto';
import { ProcesarPagoDto } from './dto/procesar-pago.dto';
import { ReembolsoRequestDto } from './dto/reembolso.dto';
import { MailService } from '../common/mail.service';
export declare class PagosService {
    private pagoRepository;
    private usuarioRepository;
    private mailService;
    constructor(pagoRepository: Repository<Pago>, usuarioRepository: Repository<Usuario>, mailService: MailService);
    crearPagoOficial(dto: CreatePagoDto): Promise<{
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
    solicitarReembolso(dto: ReembolsoRequestDto): Promise<{
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
    validarComprobante(idTransaccion: string, montoEsperado: number): Promise<{
        valido: string;
        detalle: string;
    }>;
    private enviarWebhook;
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
    cancelarPago(pagoId: number): Promise<{
        success: boolean;
        message: string;
        pagoId: number;
    }>;
    obtenerPago(id: number): Promise<Pago>;
    obtenerPagosUsuario(userId: number): Promise<Pago[]>;
    listarPagos(query: any): Promise<{
        data: Pago[];
        total: number;
        page: number;
        size: number;
    }>;
}
