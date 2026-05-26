import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('cliente')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.favoritesService.findAll(user.userId);
  }

  @Post(':providerId')
  create(
    @Param('providerId', ParseIntPipe) providerId: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.favoritesService.create(user.userId, providerId);
  }

  @Delete(':providerId')
  remove(
    @Param('providerId', ParseIntPipe) providerId: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.favoritesService.remove(user.userId, providerId);
  }
}
