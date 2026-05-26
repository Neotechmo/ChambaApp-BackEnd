import { Module } from '@nestjs/common';
import {
  CalificacionesController,
  ProviderPublicReviewsController,
  ProviderReviewSummaryController,
  RequestReviewsController,
} from './calificaciones.controller';
import { CalificacionesService } from './calificaciones.service';

@Module({
  controllers: [
    CalificacionesController,
    RequestReviewsController,
    ProviderPublicReviewsController,
    ProviderReviewSummaryController,
  ],
  providers: [CalificacionesService],
})
export class CalificacionesModule {}
