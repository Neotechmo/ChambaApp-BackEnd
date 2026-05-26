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
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { CreateRequestPaymentDto } from './dto/request-payment.dto';
import { PagosService } from './pagos.service';

@Controller('pagos')
@UseGuards(AuthGuard('jwt'))
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('cliente')
  create(@Body() data: CreatePagoDto, @CurrentUser() user: AuthUser) {
    return this.pagosService.create(data, user.userId, user.rol_id);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.pagosService.findAll(user.userId, user.rol_id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.pagosService.findOne(id, user.userId, user.rol_id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePagoDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.pagosService.update(id, data, user.userId, user.rol_id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.pagosService.remove(id, user.userId, user.rol_id);
  }
}

@Controller('requests')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RequestPaymentsController {
  constructor(private readonly pagosService: PagosService) {}

  @Get(':id/payment')
  getPayment(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.pagosService.findByRequest(id, user.userId, user.rol_id);
  }

  @Post(':id/payment')
  @Roles('cliente')
  createPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateRequestPaymentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.pagosService.createForRequest(id, data, user.userId);
  }

  @Patch(':id/payment/confirm')
  @Roles('cliente')
  confirmPayment(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.pagosService.confirm(id, user.userId);
  }
}
