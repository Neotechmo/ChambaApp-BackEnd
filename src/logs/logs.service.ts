import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { CreateLogDto } from './dto/create-log.dto';
import { Log, type LogDocument } from './schemas/log.schema';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(Log.name)
    private readonly logModel: Model<LogDocument>,
  ) {}

  async create(data: CreateLogDto) {
    return this.logModel.create(data);
  }

  async findAll() {
    return this.logModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const log = await this.logModel.findById(id).exec();

    if (!log) {
      throw new NotFoundException('Log no encontrado');
    }

    return log;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.logModel.findByIdAndDelete(id).exec();

    return {
      message: 'Log eliminado correctamente',
    };
  }
}
