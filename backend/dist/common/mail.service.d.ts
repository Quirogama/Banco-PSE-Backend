import { ConfigService } from '@nestjs/config';
import { Correo } from '../pagos/correo.entity';
import { Repository } from 'typeorm';
export declare class MailService {
    private configService;
    private correoRepository;
    private transporter;
    constructor(configService: ConfigService, correoRepository: Repository<Correo>);
    enviarConfirmacionPago(destinatario: string, nombreUsuario: string, monto: number, fechaPago: Date, pagoId: number): Promise<{
        success: boolean;
        messageId: string;
    }>;
}
