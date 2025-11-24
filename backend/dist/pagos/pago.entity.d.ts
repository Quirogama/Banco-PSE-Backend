import { Usuario } from '../auth/usuario.entity';
export declare class Pago {
    id: number;
    idUsuario: number;
    fecha: Date;
    monto: number;
    estado: string;
    usuario: Usuario;
    correos: Array<{
        id: number;
        asunto: string;
        cuerpo: string;
    }>;
}
