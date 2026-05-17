import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import { SolicitudesService } from './solicitudes.service';

@Controller('solicitudes')
@UseGuards(AuthGuard('jwt'))
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'cliente')
  create(@Body() data: CreateSolicitudDto, @CurrentUser() user: AuthUser) {
    return this.solicitudesService.create(data, user.userId);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.solicitudesService.findAll(user.userId, user.rol_id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.solicitudesService.findOne(id, user.userId, user.rol_id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateSolicitudDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.solicitudesService.update(id, data, user.userId, user.rol_id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.solicitudesService.remove(id, user.userId, user.rol_id);
  }
}
