import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LogDocument = HydratedDocument<Log>;

@Schema({ timestamps: true })
export class Log {
  @Prop()
  userId?: number;

  @Prop({ required: true })
  action!: string;

  @Prop()
  entity?: string;

  @Prop()
  entityId?: string;

  @Prop({ type: Object })
  metadata?: Record<string, unknown>;
}

export const LogSchema = SchemaFactory.createForClass(Log);
