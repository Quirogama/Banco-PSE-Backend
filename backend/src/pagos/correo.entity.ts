import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Pago } from './pago.entity';

@Entity('correo')
export class Correo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_pago' })
  @Index()
  idPago: number;

  @Column({ nullable: true, length: 255 })
  asunto: string;

  @Column({ type: 'text', nullable: true })
  cuerpo: string;

  @ManyToOne(() => Pago, (pago) => pago.correos)
  @JoinColumn({ name: 'id_pago' })
  pago: Pago | null;
}
