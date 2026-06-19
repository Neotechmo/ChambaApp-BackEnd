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

/**
 * TTL Index — Retención de logs: 90 días (7 776 000 segundos).
 * Cumple checklist 11.1 "Retención de logs definida".
 * MongoDB elimina automáticamente los documentos vencidos.
 */
LogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7_776_000 });
