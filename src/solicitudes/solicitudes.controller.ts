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
import { CreateRequestDto } from './dto/create-request.dto';
import { RejectRequestDto, UpdateJobStatusDto } from './dto/request-action.dto';
import {
  ProposeDateDto,
  RescheduleRequestDto,
} from './dto/reschedule-request.dto';
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
    return this.solicitudesService.findRequest(id, user.userId, user.rol_id);
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

@Controller('requests')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RequestsController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Post()
  @Roles('cliente')
  create(@Body() data: CreateRequestDto, @CurrentUser() user: AuthUser) {
    return this.solicitudesService.createRequest(data, user.userId);
  }

  @Get('mine')
  @Roles('cliente')
  findMine(@CurrentUser() user: AuthUser) {
    return this.solicitudesService.findMine(user.userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.solicitudesService.findRequest(id, user.userId, user.rol_id);
  }

  @Patch(':id/cancel')
  @Roles('cliente')
  cancel(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.solicitudesService.cancelRequest(id, user.userId);
  }

  @Patch(':id/reschedule')
  @Roles('cliente')
  reschedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: RescheduleRequestDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.solicitudesService.rescheduleRequest(id, user.userId, data);
  }

  @Patch(':id/accept-date')
  @Roles('cliente')
  acceptProposedDate(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.solicitudesService.acceptProposedDate(id, user.userId);
  }
}

@Controller('provider')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('prestador')
export class ProviderRequestsController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Get('requests')
  findRequests(@CurrentUser() user: AuthUser) {
    return this.solicitudesService.findProviderRequests(user.userId);
  }

  @Patch('requests/:id/accept')
  accept(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.solicitudesService.acceptRequest(id, user.userId);
  }

  @Patch('requests/:id/reject')
  reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: RejectRequestDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.solicitudesService.rejectRequest(id, user.userId, data.motivo);
  }

  @Patch('requests/:id/propose-date')
  proposeDate(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ProposeDateDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.solicitudesService.proposeDate(
      id,
      user.userId,
      data.fechaPropuesta,
    );
  }

  @Get('jobs')
  findJobs(@CurrentUser() user: AuthUser) {
    return this.solicitudesService.findProviderJobs(user.userId);
  }

  @Patch('jobs/:id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateJobStatusDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.solicitudesService.updateJobStatus(
      id,
      user.userId,
      data.status,
    );
  }

  @Get('calendar')
  getCalendar(@CurrentUser() user: AuthUser) {
    return this.solicitudesService.findProviderCalendar(user.userId);
  }
}
