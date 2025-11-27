import { Pago } from '../pagos/pago.entity';
export declare class Usuario {
    id: number;
    tipoDocumento: string;
    documento: string;
    nombre: string;
    apellido: string;
    email: string;
    contrasena: string;
    telefono: string;
    ocupacion: string;
    rol: string;
    balance: number;
    pagos: Pago[];
}
