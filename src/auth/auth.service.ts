import type { LoggerService } from '@nestjs/common';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async register(data: RegisterDto) {
    this.logger.log(
      { message: 'Intento de registro', correo: data.correo },
      'AuthService',
    );

    const userExists = await this.prisma.usuario.findUnique({
      where: {
        correo: data.correo,
      },
    });

    if (userExists) {
      this.logger.warn(
        { message: 'Registro fallido: correo duplicado', correo: data.correo },
        'AuthService',
      );
      throw new ConflictException('El correo ya existe');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const roleName = data.rol ?? (data.rol_id === 3 ? 'prestador' : 'cliente');
    const role = await this.prisma.role.findUnique({
      where: {
        nombre: roleName,
      },
    });

    if (!role) {
      throw new BadRequestException('Rol no valido para registro');
    }

    const user = await this.prisma.usuario.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        telefono: data.telefono,
        password_hash: hashedPassword,
        rol_id: role.id,
      },
      include: {
        rol: true,
      },
    });

    this.logger.log(
      { message: 'Usuario registrado', userId: user.id, rol: user.rol.nombre },
      'AuthService',
    );

    return {
      message: `Usuario ${data.nombre} ha sido registrado`,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        rol: user.rol.nombre,
        telefono: user.telefono,
      },
    };
  }

  async login(data: LoginDto) {
    const user = await this.prisma.usuario.findUnique({
      where: {
        correo: data.correo,
      },
      include: {
        rol: true,
      },
    });

    if (!user) {
      this.logger.warn(
        { message: 'Login fallido: usuario no encontrado', correo: data.correo },
        'AuthService',
      );
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (!user.activo) {
      this.logger.warn(
        { message: 'Login fallido: cuenta desactivada', userId: user.id },
        'AuthService',
      );
      throw new UnauthorizedException('La cuenta esta desactivada');
    }

    const passwordMatch = await bcrypt.compare(
      data.password,
      user.password_hash,
    );

    if (!passwordMatch) {
      this.logger.warn(
        { message: 'Login fallido: contraseña incorrecta', userId: user.id },
        'AuthService',
      );
      throw new UnauthorizedException('Contraseña es incorrecta');
    }

    this.logger.log(
      { message: 'Login exitoso', userId: user.id, rol: user.rol.nombre },
      'AuthService',
    );

    const payload = {
      sub: user.id,
      correo: user.correo,
      rol_id: user.rol_id,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        rol: user.rol.nombre,
        telefono: user.telefono,
        avatar: user.foto_perfil,
      },
    };
  }
}
