import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { ProcesarPagoDto } from './dto/procesar-pago.dto';
export declare class PagosController {
    private pagosService;
    constructor(pagosService: PagosService);
    crearPago(createPagoDto: CreatePagoDto): Promise<{
        pagoId: number;
        redirectUrl: string;
        message: string;
    }>;
    procesarPago(procesarPagoDto: ProcesarPagoDto): Promise<{
        success: boolean;
        message: string;
        pagoId: number;
        nuevoBalance: number;
    }>;
    obtenerPago(id: string): Promise<import("./pago.entity").Pago>;
    obtenerMisPagos(req: any): Promise<import("./pago.entity").Pago[]>;
}
