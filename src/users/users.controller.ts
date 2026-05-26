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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateProviderProfileDto } from './dto/update-provider-profile.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@CurrentUser() user: AuthUser) {
    return this.usersService.getProfile(user.userId);
  }

  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(@Body() data: UpdateProfileDto, @CurrentUser() user: AuthUser) {
    return this.usersService.updateProfile(user.userId, data);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.usersService.update(id, data, user.userId, user.rol_id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}

@Controller('providers')
export class ProvidersProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('prestador')
  updateProfessionalProfile(
    @Body() data: UpdateProviderProfileDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.usersService.updateProviderProfile(user.userId, data);
  }
}

@Controller('provider')
export class ProviderAvailabilityController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('availability')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('prestador')
  updateAvailability(
    @Body() data: UpdateAvailabilityDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.usersService.updateProviderProfile(user.userId, data);
  }
}
