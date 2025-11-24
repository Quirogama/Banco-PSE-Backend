import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './usuario.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Verificar si el email ya existe
    const existingUser = await this.usuarioRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.contrasena, 10);

    // Crear nuevo usuario
    const usuario = this.usuarioRepository.create({
      ...registerDto,
      contrasena: hashedPassword,
      balance: 0,
    });

    await this.usuarioRepository.save(usuario);

    // Retornar sin la contraseña
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contrasena, ...result } = usuario;
    return result;
  }

  async login(loginDto: LoginDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      loginDto.contrasena,
      usuario.contrasena,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token JWT
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };

    const token = this.jwtService.sign(payload);

    // Retornar token y datos del usuario (sin contraseña)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contrasena, ...userData } = usuario;

    return {
      access_token: token,
      user: userData,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const usuario = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (usuario && (await bcrypt.compare(password, usuario.contrasena))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { contrasena, ...result } = usuario;
      return result;
    }

    return null;
  }

  async findById(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { email } });
  }
}
