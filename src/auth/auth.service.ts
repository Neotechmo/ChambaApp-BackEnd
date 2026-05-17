import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const userExists = await this.prisma.usuario.findUnique({
      where: {
        correo: data.correo,
      },
    });

    if (userExists) {
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

    return {
      message: `Usuario ${data.nombre} ha sido registrado`,
      user: {
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol.nombre,
        telefono: user.telefono
          ? user.telefono
          : 'No hay un teléfono registrado para este usuario',
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
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const passwordMatch = await bcrypt.compare(
      data.password,
      user.password_hash,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Contraseña es incorrecta');
    }

    const payload = {
      sub: user.id,
      correo: user.correo,
      rol_id: user.rol_id,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user: {
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol.nombre,
        telefono: user.telefono
          ? user.telefono
          : 'No hay un teléfono registrado para este usuario',
      },
    };
  }
}
