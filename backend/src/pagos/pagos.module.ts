import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { Pago } from './pago.entity';
import { Correo } from './correo.entity';
import { Usuario } from '../auth/usuario.entity';
import { MailService } from '../common/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pago, Correo, Usuario])],
  controllers: [PagosController],
  providers: [PagosService, MailService],
  exports: [TypeOrmModule],
})
export class PagosModule {}
