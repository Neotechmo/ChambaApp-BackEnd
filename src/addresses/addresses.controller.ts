import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/types/auth-user.type';
import { AddressDto } from './dto/address.dto';
import { AddressesService } from './addresses.service';

@Controller('addresses')
@UseGuards(AuthGuard('jwt'))
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.addressesService.findAll(user.userId);
  }

  @Post()
  create(@Body() data: AddressDto, @CurrentUser() user: AuthUser) {
    return this.addressesService.create(user.userId, data);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: AddressDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.addressesService.update(id, user.userId, data);
  }
}
