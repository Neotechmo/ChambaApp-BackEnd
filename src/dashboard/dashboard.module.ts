import { Module } from '@nestjs/common';
import {
  DashboardController,
  ProviderEarningsController,
} from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  controllers: [DashboardController, ProviderEarningsController],
  providers: [DashboardService],
})
export class DashboardModule {}
