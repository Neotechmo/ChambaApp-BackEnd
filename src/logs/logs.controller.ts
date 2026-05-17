import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateLogDto } from './dto/create-log.dto';
import { LogsService } from './logs.service';

@Controller('logs')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  create(@Body() data: CreateLogDto) {
    return this.logsService.create(data);
  }

  @Get()
  findAll() {
    return this.logsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logsService.remove(id);
  }
}
