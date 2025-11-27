import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private usuarioRepository;
    private jwtService;
    constructor(usuarioRepository: Repository<Usuario>, jwtService: JwtService);
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
    validateUser(email: string, password: string): Promise<any>;
    findById(id: number): Promise<Usuario | null>;
    findByEmail(email: string): Promise<Usuario | null>;
}
