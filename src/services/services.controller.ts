import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { ServicesService } from './services.service';

import { CreateServiceDto } from './dto/create-service.dto';

import type { Request } from 'express';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() data: CreateServiceDto,

    @Req()
    req: Request & {
      user: {
        userId: number;
      };
    },
  ) {
    return this.servicesService.create(data, req.user.userId);
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }
}
