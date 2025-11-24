import { Pago } from './pago.entity';
export declare class Correo {
    id: number;
    idPago: number;
    asunto: string;
    cuerpo: string;
    pago: Pago | null;
}
