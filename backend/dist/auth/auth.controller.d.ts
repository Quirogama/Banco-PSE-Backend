import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        id: number;
        tipoDocumento: string;
        documento: string;
        nombre: string;
        apellido: string;
        email: string;
        telefono: string;
        ocupacion: string;
        rol: string;
        balance: number;
        pagos: import("../pagos/pago.entity").Pago[];
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            tipoDocumento: string;
            documento: string;
            nombre: string;
            apellido: string;
            email: string;
            telefono: string;
            ocupacion: string;
            rol: string;
            balance: number;
            pagos: import("../pagos/pago.entity").Pago[];
        };
    }>;
    getProfile(req: any): Promise<{
        id: number;
        tipoDocumento: string;
        documento: string;
        nombre: string;
        apellido: string;
        email: string;
        telefono: string;
        ocupacion: string;
        rol: string;
        balance: number;
        pagos: import("../pagos/pago.entity").Pago[];
    } | null>;
}
