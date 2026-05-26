import { Module } from '@nestjs/common';
import {
  CategoriesController,
  ServicesController,
} from './services.controller';
import { ServicesService } from './services.service';

@Module({
  controllers: [ServicesController, CategoriesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
