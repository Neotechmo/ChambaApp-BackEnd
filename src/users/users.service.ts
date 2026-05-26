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
import type { UpdateProfileDto } from './dto/update-profile.dto';
import type { UpdateProviderProfileDto } from './dto/update-provider-profile.dto';

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

  async getProfile(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
      include: {
        rol: true,
        solicitudes: { select: { estado: true } },
        favoritos_cliente: { select: { id: true } },
        calificaciones_realizadas: { select: { puntuacion: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const ratings = user.calificaciones_realizadas;
    const ratingExperiencia = ratings.length
      ? ratings.reduce((total, rating) => total + rating.puntuacion, 0) /
        ratings.length
      : null;

    return {
      id: user.id,
      rol: user.rol.nombre,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      telefono: user.telefono,
      avatar: user.foto_perfil,
      ubicacion: {
        ciudad: user.ciudad,
        estado: user.estado,
        lat: user.lat,
        lng: user.lng,
      },
      preferencias: user.preferencias ?? {},
      estadisticas: {
        solicitudes: user.solicitudes.length,
        completados: user.solicitudes.filter(
          (request) => request.estado === 'completed',
        ).length,
        favoritos: user.favoritos_cliente.length,
        ratingExperiencia,
      },
      especialidad: user.especialidad,
      descripcion: user.descripcion_profesional,
      experienciaAnios: user.experiencia_anios,
      precioHora: user.precio_hora,
      zonaCobertura: user.zona_cobertura,
      disponible: user.disponible,
      verificado: user.verificado,
      etiquetas: user.etiquetas,
    };
  }

  async updateProfile(id: number, data: UpdateProfileDto) {
    if (data.correo) {
      const existing = await this.prisma.usuario.findUnique({
        where: { correo: data.correo },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('El correo ya existe');
      }
    }

    await this.prisma.usuario.update({
      where: { id },
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        telefono: data.telefono,
        foto_perfil: data.avatar,
        ciudad: data.ubicacion?.ciudad,
        estado: data.ubicacion?.estado,
        lat: data.ubicacion?.lat,
        lng: data.ubicacion?.lng,
        preferencias: data.preferencias,
      },
    });

    return this.getProfile(id);
  }

  async updateProviderProfile(id: number, data: UpdateProviderProfileDto) {
    await this.prisma.usuario.update({
      where: { id },
      data: {
        especialidad: data.especialidad,
        descripcion_profesional: data.descripcion,
        experiencia_anios: data.experienciaAnios,
        precio_hora: data.precioHora,
        zona_cobertura: data.zonaCobertura,
        disponible: data.disponible,
        etiquetas: data.etiquetas,
      },
    });

    return this.getProfile(id);
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
