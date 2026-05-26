import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('client')
  @Roles('cliente')
  client(@CurrentUser() user: AuthUser) {
    return this.dashboardService.client(user.userId);
  }

  @Get('provider')
  @Roles('prestador')
  provider(@CurrentUser() user: AuthUser) {
    return this.dashboardService.provider(user.userId);
  }
}

@Controller('provider')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('prestador')
export class ProviderEarningsController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('earnings/summary')
  earnings(
    @CurrentUser() user: AuthUser,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.dashboardService.earnings(user.userId, from, to);
  }

  @Get('transactions')
  transactions(@CurrentUser() user: AuthUser) {
    return this.dashboardService.transactions(user.userId);
  }
}
