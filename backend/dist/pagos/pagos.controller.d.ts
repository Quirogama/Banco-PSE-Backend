import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { ProcesarPagoDto } from './dto/procesar-pago.dto';
import type { Response } from 'express';
export declare class PagosController {
    private pagosService;
    constructor(pagosService: PagosService);
    crearPago(createPagoDto: CreatePagoDto, res: Response): Promise<void>;
    procesarPago(procesarPagoDto: ProcesarPagoDto, res: Response): Promise<void>;
    obtenerPago(id: string): Promise<import("./pago.entity").Pago>;
    obtenerMisPagos(req: any): Promise<import("./pago.entity").Pago[]>;
}
