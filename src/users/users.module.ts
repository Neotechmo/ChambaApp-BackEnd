import { Module } from '@nestjs/common';
import {
  ProviderAvailabilityController,
  ProvidersProfileController,
  UsersController,
} from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [
    UsersController,
    ProvidersProfileController,
    ProviderAvailabilityController,
  ],
  providers: [UsersService],
})
export class UsersModule {}
