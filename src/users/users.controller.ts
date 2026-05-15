import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('users')
export class UsersController {
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(
    @Req()
    req: Request & {
      user: {
        userId: number;
        correo: string;
        rol_id: number;
      };
    },
  ) {
    return {
      message: 'Ruta protegida',
      user: req.user,
    };
  }
}
