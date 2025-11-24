import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Usuario } from '../auth/usuario.entity';

@Entity('pago')
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_usuario' })
  @Index()
  idUsuario: number;

  @Column({ type: 'date', nullable: true })
  fecha: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  monto: number;

  @Column({ nullable: true, length: 50 })
  estado: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.pagos)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @OneToMany('Correo', 'pago')
  correos: Array<{ id: number; asunto: string; cuerpo: string }>;
}
