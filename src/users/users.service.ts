import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const userExists = await this.prisma.usuario.findUnique({
      where: { correo: data.correo },
    });

    if (userExists) {
      throw new ConflictException('El correo ya existe');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.prisma.usuario.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        password_hash: passwordHash,
        telefono: data.telefono,
        foto_perfil: data.foto_perfil,
        activo: data.activo,
        verificado: data.verificado,
        rol_id: data.rol_id,
      },
      select: this.userSelect(),
    });
  }

  async findAll() {
    return this.prisma.usuario.findMany({
      select: this.userSelect(),
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
      select: this.userSelect(),
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async update(
    id: number,
    data: UpdateUserDto,
    requesterId: number,
    rolId: number,
  ) {
    if (rolId !== 1 && requesterId !== id) {
      throw new ForbiddenException('No puedes editar este usuario');
    }

    await this.findOne(id);

    if (data.correo) {
      const userExists = await this.prisma.usuario.findUnique({
        where: { correo: data.correo },
      });

      if (userExists && userExists.id !== id) {
        throw new ConflictException('El correo ya existe');
      }
    }

    const passwordHash = data.password
      ? await bcrypt.hash(data.password, 10)
      : undefined;

    return this.prisma.usuario.update({
      where: { id },
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        password_hash: passwordHash,
        telefono: data.telefono,
        foto_perfil: data.foto_perfil,
        activo: data.activo,
        verificado: data.verificado,
        rol_id: rolId === 1 ? data.rol_id : undefined,
      },
      select: this.userSelect(),
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.usuario.delete({
      where: { id },
    });

    return {
      message: 'Usuario eliminado correctamente',
    };
  }

  private userSelect() {
    return {
      id: true,
      nombre: true,
      apellido: true,
      correo: true,
      telefono: true,
      foto_perfil: true,
      activo: true,
      verificado: true,
      fecha_registro: true,
      rol: true,
      servicios: true,
      solicitudes: true,
      calificaciones_realizadas: true,
      calificaciones_recibidas: true,
    };
  }
}
