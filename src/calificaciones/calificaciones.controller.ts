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
import { CalificacionesService } from './calificaciones.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('calificaciones')
@UseGuards(AuthGuard('jwt'))
export class CalificacionesController {
  constructor(private readonly calificacionesService: CalificacionesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'cliente')
  create(@Body() data: CreateCalificacionDto, @CurrentUser() user: AuthUser) {
    return this.calificacionesService.create(data, user.userId, user.rol_id);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.calificacionesService.findAll(user.userId, user.rol_id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.calificacionesService.findOne(id, user.userId, user.rol_id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCalificacionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.calificacionesService.update(
      id,
      data,
      user.userId,
      user.rol_id,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.calificacionesService.remove(id, user.userId, user.rol_id);
  }
}

@Controller('requests')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RequestReviewsController {
  constructor(private readonly calificacionesService: CalificacionesService) {}

  @Post(':id/review')
  @Roles('cliente')
  create(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateReviewDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.calificacionesService.createReview(id, data, user.userId);
  }
}

@Controller('providers')
export class ProviderPublicReviewsController {
  constructor(private readonly calificacionesService: CalificacionesService) {}

  @Get(':id/reviews')
  findReviews(@Param('id', ParseIntPipe) id: number) {
    return this.calificacionesService.providerReviews(id);
  }
}

@Controller('provider')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('prestador')
export class ProviderReviewSummaryController {
  constructor(private readonly calificacionesService: CalificacionesService) {}

  @Get('reviews/summary')
  summary(@CurrentUser() user: AuthUser) {
    return this.calificacionesService.providerReviews(user.userId);
  }
}
