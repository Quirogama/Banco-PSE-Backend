import { Usuario } from '../auth/usuario.entity';
export declare class Pago {
    id: number;
    idUsuario: number;
    fecha: Date;
    monto: number;
    estado: string;
    referenciaTransaccion: string;
    descripcionPago: string;
    cedulaCliente: string;
    nombreCliente: string;
    urlRespuesta: string;
    urlNotificacion: string;
    destinatario: string;
    codigoAutorizacion: string;
    usuario: Usuario;
    correos: Array<{
        id: number;
        asunto: string;
        cuerpo: string;
    }>;
}
